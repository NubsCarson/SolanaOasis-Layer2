import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { Octokit } from '@octokit/rest';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN
});

async function createRepository(name: string, description: string) {
  try {
    const response = await octokit.repos.createForAuthenticatedUser({
      name,
      description,
      auto_init: true,
      private: false
    });
    return response.data;
  } catch (error) {
    console.error('Error creating repository:', error);
    throw error;
  }
}

async function commitCode(repo: string, files: Array<{ path: string, content: string }>) {
  try {
    // Get the default branch
    const { data: repository } = await octokit.repos.get({
      owner: process.env.GITHUB_USERNAME!,
      repo,
    });
    const defaultBranch = repository.default_branch;

    // Get the latest commit SHA
    const { data: ref } = await octokit.git.getRef({
      owner: process.env.GITHUB_USERNAME!,
      repo,
      ref: `heads/${defaultBranch}`,
    });
    const latestCommitSha = ref.object.sha;

    // Create blobs for each file
    const fileBlobs = await Promise.all(
      files.map(file =>
        octokit.git.createBlob({
          owner: process.env.GITHUB_USERNAME!,
          repo,
          content: Buffer.from(file.content).toString('base64'),
          encoding: 'base64',
        })
      )
    );

    // Create tree
    const { data: tree } = await octokit.git.createTree({
      owner: process.env.GITHUB_USERNAME!,
      repo,
      base_tree: latestCommitSha,
      tree: files.map((file, index) => ({
        path: file.path,
        mode: '100644',
        type: 'blob',
        sha: fileBlobs[index].data.sha,
      })),
    });

    // Create commit
    const { data: commit } = await octokit.git.createCommit({
      owner: process.env.GITHUB_USERNAME!,
      repo,
      message: 'Initial project setup by AI',
      tree: tree.sha,
      parents: [latestCommitSha],
    });

    // Update reference
    await octokit.git.updateRef({
      owner: process.env.GITHUB_USERNAME!,
      repo,
      ref: `heads/${defaultBranch}`,
      sha: commit.sha,
    });

    return commit;
  } catch (error) {
    console.error('Error committing code:', error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check for API key
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || !process.env.OPENAI_VERIFICATION_TOKEN || 
        apiKey !== process.env.OPENAI_VERIFICATION_TOKEN) {
      console.log('Auth failed:', { 
        received: apiKey,
        expected: process.env.OPENAI_VERIFICATION_TOKEN ? 'set' : 'not set'
      });
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { prompt, projectType = 'web' } = req.body;
    if (!prompt || !projectType) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    console.log('Received request:', { prompt, projectType });

    // Generate project idea
    const ideaCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a creative AI that generates interesting and innovative ${projectType} project ideas. Focus on projects that are feasible for a skilled developer to complete within a few weeks.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 150
    });

    const projectIdea = ideaCompletion.choices[0]?.message?.content || "No idea generated";
    const projectName = projectIdea.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    console.log('Generated project idea:', projectIdea);
    console.log('Project name:', projectName);

    // Generate project code
    const codeCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert developer that generates high-quality, production-ready code. Generate a complete project structure and code files for the following ${projectType} project idea. 
          Return the response as a JSON object with a 'files' array, where each file has a 'path' and 'content' property.
          Include:
          - README.md with setup instructions
          - package.json or relevant dependency file
          - Main source code files
          - Basic project structure`
        },
        {
          role: "user",
          content: `Generate a complete project structure and code for: ${projectIdea}\nProject name: ${projectName}`
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });

    const generatedFiles = JSON.parse(codeCompletion.choices[0]?.message?.content || "{ \"files\": [] }");
    console.log('Generated files:', generatedFiles.files.length);

    // Create GitHub repository
    const repo = await createRepository(projectName, projectIdea);
    console.log('Created repository:', repo.html_url);

    // Commit files to repository
    await commitCode(projectName, generatedFiles.files);
    console.log('Committed files to repository');

    res.status(200).json({
      idea: projectIdea,
      repositoryUrl: repo.html_url,
      files: generatedFiles.files
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to create project', details: error.message });
  }
} 