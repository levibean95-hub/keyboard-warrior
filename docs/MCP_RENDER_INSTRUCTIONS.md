# Using Render MCP Server for Deployment

Your Render MCP server is connected and authenticated. Here's how to use it:

## Connection Status
✅ **Render MCP Server**: Connected
- **URL**: https://mcp.render.com/mcp  
- **Status**: Authenticated with Bearer token
- **Scope**: Local config (private to this project)

## MCP Tools Available

Since your Render MCP server is connected, you should have access to tools like:

1. **list_workspaces** - List available workspaces
2. **set_workspace** - Set the active workspace  
3. **create_service** - Create a new web service
4. **get_services** - List existing services
5. **update_service** - Update service configuration
6. **deploy_service** - Deploy from repository

## Steps to Deploy Using MCP

### Step 1: Setup GitHub Repository First

**CRITICAL**: You must push your code to GitHub before Render can deploy it.

```bash
# Create repository on GitHub.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/keyboard-warrior.git
git add .
git commit -m "Initial commit with Render deployment config"
git push -u origin main
```

### Step 2: Use MCP Tools

Once your code is on GitHub, you can use the Render MCP tools. In Claude Code, try these tool calls:

```javascript
// List available workspaces
render_list_workspaces()

// Set workspace (if you have multiple)
render_set_workspace({ workspace_id: "your-workspace-id" })

// Create the web service
render_create_service({
  name: "keyboard-warrior-backend",
  type: "web_service",
  repo_url: "https://github.com/YOUR_USERNAME/keyboard-warrior",
  branch: "main",
  dockerfile_path: "./backend/Dockerfile.render",
  docker_context: "./backend",
  env_vars: {
    NODE_ENV: "production",
    PORT: "5000",
    CORS_ORIGIN: "", // Set this to your Vercel URL later
    DATABASE_URL: "file:/app/data/keyboard-warrior.db",
    RATE_LIMIT_WINDOW_MS: "900000",
    RATE_LIMIT_MAX_REQUESTS: "100"
  },
  auto_deploy: true,
  health_check_path: "/health"
})
```

## Alternative: Use render.yaml

Your project has a pre-configured `render.yaml` file. The MCP server should be able to:

```javascript
// Deploy using render.yaml configuration
render_deploy_from_yaml({
  repo_url: "https://github.com/YOUR_USERNAME/keyboard-warrior",
  branch: "main"
})
```

## Environment Variables to Set Manually

These variables need to be set in the Render dashboard after creation:

- **OPENAI_API_KEY**: Your OpenAI API key
- **CORS_ORIGIN**: Your frontend URL (e.g., https://your-app.vercel.app)
- **JWT_SECRET**: Let Render auto-generate this

## Expected Outcome

After successful deployment:
- **Service URL**: `https://keyboard-warrior-backend.onrender.com`
- **Health Check**: `https://keyboard-warrior-backend.onrender.com/health`
- **API Base**: `https://keyboard-warrior-backend.onrender.com/api`

## Troubleshooting MCP Issues

If MCP tools don't work as expected:

1. **Check Authentication**: Your token might need refresh
2. **Manual Fallback**: Use the Render dashboard directly
3. **Verify Repository**: Ensure code is pushed to GitHub
4. **Check render.yaml**: Ensure the file is in the repository root

## Service Configuration (from render.yaml)

The service will be created with:
- **Runtime**: Docker
- **Plan**: Free (750 hours/month)
- **Region**: Oregon
- **Auto-scaling**: Enabled
- **Health Monitoring**: Enabled

---

**Next Steps**:
1. Push code to GitHub
2. Use MCP tools to deploy
3. Configure environment variables
4. Test deployment
5. Deploy frontend to Vercel with backend URL