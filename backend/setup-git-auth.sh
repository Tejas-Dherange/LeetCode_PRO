#!/bin/bash
# Quick setup script for Git authentication on Digital Ocean droplet
# Run this ONCE on your droplet to avoid entering username/token

set -e

echo "🔧 Setting up Git authentication for deployments..."

# Check if SSH key exists
if [ -f ~/.ssh/id_ed25519 ] || [ -f ~/.ssh/id_rsa ]; then
    echo "✅ SSH key found"
else
    echo "📝 Generating new SSH key..."
    ssh-keygen -t ed25519 -C "deploy@codeloom" -f ~/.ssh/id_ed25519 -N ""
    echo "✅ SSH key generated"
fi

# Display public key
echo ""
echo "🔑 Your SSH public key (add this to GitHub > Settings > SSH Keys):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cat ~/.ssh/id_ed25519.pub || cat ~/.ssh/id_rsa.pub
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Switch to SSH remote
cd ~/LeetCode_PRO
CURRENT_REMOTE=$(git config --get remote.origin.url)

if [[ $CURRENT_REMOTE == https* ]]; then
    echo "🔄 Converting Git remote from HTTPS to SSH..."
    
    # Extract username and repo name
    REPO_PATH=$(echo $CURRENT_REMOTE | sed 's|https://github.com/||' | sed 's|.git||')
    SSH_URL="git@github.com:${REPO_PATH}.git"
    
    git remote set-url origin $SSH_URL
    echo "✅ Remote URL updated to: $SSH_URL"
else
    echo "✅ Already using SSH remote: $CURRENT_REMOTE"
fi

# Test SSH connection
echo ""
echo "🧪 Testing GitHub SSH connection..."
ssh -T git@github.com || true

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Copy the SSH public key above"
echo "2. Go to: https://github.com/settings/keys"
echo "3. Click 'New SSH key'"
echo "4. Paste the key and save"
echo "5. Run: cd ~/LeetCode_PRO && git pull"
echo ""
echo "After this, you won't need to enter username/token anymore! 🎉"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
