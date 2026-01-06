# Git Authentication Fix for Digital Ocean Droplet

## Problem
When running `git pull` in the deploy script, it asks for username and token every time.

## Solution: Use SSH Instead of HTTPS

### Quick Fix (Automated)

**On your Digital Ocean droplet, run:**

```bash
# Download and run the setup script
cd ~/LeetCode_PRO/backend
chmod +x setup-git-auth.sh
./setup-git-auth.sh
```

This script will:
1. ✅ Generate an SSH key (if not exists)
2. ✅ Display your public key
3. ✅ Convert your Git remote from HTTPS to SSH
4. ✅ Test the connection

### Manual Setup (Step-by-Step)

#### Step 1: Generate SSH Key on Droplet

```bash
# SSH into your droplet
ssh root@your-droplet-ip

# Generate SSH key
ssh-keygen -t ed25519 -C "deploy@codeloom" -f ~/.ssh/id_ed25519 -N ""

# Display the public key
cat ~/.ssh/id_ed25519.pub
```

**Copy the entire output** (starts with `ssh-ed25519 ...`)

#### Step 2: Add SSH Key to GitHub

1. Go to: https://github.com/settings/keys
2. Click **"New SSH key"**
3. Title: `Digital Ocean Droplet`
4. Paste the copied public key
5. Click **"Add SSH key"**

#### Step 3: Switch Git Remote to SSH

```bash
# Check current remote
cd ~/LeetCode_PRO
git remote -v

# Change from HTTPS to SSH
git remote set-url origin git@github.com:Tejas-Dherange/LeetCode_PRO.git

# Verify the change
git remote -v
```

#### Step 4: Test SSH Connection

```bash
# Test GitHub SSH connection
ssh -T git@github.com

# You should see:
# Hi Tejas-Dherange! You've successfully authenticated...
```

#### Step 5: Test Git Pull

```bash
cd ~/LeetCode_PRO
git pull origin main

# Should work without asking for credentials! ✅
```

---

## Alternative Solution: Git Credential Cache (HTTPS)

If you prefer to keep using HTTPS, you can cache credentials:

```bash
# Cache credentials for 1 week (604800 seconds)
git config --global credential.helper 'cache --timeout=604800'

# Or store credentials permanently (less secure)
git config --global credential.helper store

# Next time you pull, enter credentials once
git pull origin main
# Username: Tejas-Dherange
# Password: ghp_YOUR_PERSONAL_ACCESS_TOKEN

# Subsequent pulls won't ask for credentials
```

**Note:** For the password, use a [GitHub Personal Access Token](https://github.com/settings/tokens), not your actual password.

---

## Verify Setup

After applying the fix, test your deploy script:

```bash
cd ~/LeetCode_PRO/backend
./deploy.sh
```

It should run without asking for credentials! 🎉

---

## Troubleshooting

### Issue: "Permission denied (publickey)"

**Fix:**
```bash
# Ensure SSH key has correct permissions
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub

# Test connection again
ssh -T git@github.com
```

### Issue: "Could not resolve hostname"

**Fix:**
```bash
# Check internet connection
ping github.com

# Ensure DNS is working
cat /etc/resolv.conf
```

### Issue: Still asking for credentials after SSH setup

**Fix:**
```bash
# Verify remote is using SSH
cd ~/LeetCode_PRO
git remote -v

# Should show:
# origin  git@github.com:Tejas-Dherange/LeetCode_PRO.git (fetch)
# origin  git@github.com:Tejas-Dherange/LeetCode_PRO.git (push)

# If it shows https://, run:
git remote set-url origin git@github.com:Tejas-Dherange/LeetCode_PRO.git
```

---

## Security Best Practices

✅ **Do:**
- Use SSH keys for deployment servers
- Restrict SSH key permissions (chmod 600)
- Use deploy keys for production (Settings > Deploy keys)
- Rotate keys periodically

❌ **Don't:**
- Store passwords in plain text
- Share SSH private keys
- Use personal credentials for deployments
- Commit `.env` files with credentials
