const axios = require('axios');

exports.handler = async (event, context) => {
  const payload = JSON.parse(event.body);

  if (payload.action === 'in_progress') {
    const branchName = `issue-${payload.id}-${payload.title.replace(/\s+/g, '-')}`;

    try {
      await axios.post(
        `https://gitlab.com/api/v4/projects/${process.env.GITLAB_PROJECT_ID}/repository/branches`,
        {
          branch: branchName,
          ref: 'main',
        },
        {
          headers: {
            'Private-Token': process.env.GITLAB_TOKEN,
          },
        }
      );

      return {
        statusCode: 200,
        body: 'Branch created successfully',
      };
    } catch (error) {
      console.error('Error creating branch:', error);
      return {
        statusCode: 500,
        body: 'Failed to create branch',
      };
    }
  }

  return {
    statusCode: 200,
    body: 'No action required',
  };
};
