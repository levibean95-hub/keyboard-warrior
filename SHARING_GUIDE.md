# 🌐 How to Share Keyboard Warrior with Friends

## ✨ Your Public URL is Ready!

**Your app is now accessible at:** `https://keyboardwarrior.loca.lt`

## 📱 For Your Friends to Access:

1. **Share this URL:** `https://keyboardwarrior.loca.lt`

2. **First-time access:** When they visit, they'll see:
   - A password prompt (it's displayed on their screen)
   - They need to enter that password
   - Click "Click to Continue"
   - Then they'll see your app!

## 🚀 Easy Start/Stop Commands

### Start Sharing:
```bash
# Double-click or run:
start-sharing.bat
```

### Stop Sharing:
```bash
# Double-click or run:
stop-sharing.bat
```

### Manual Commands:
```bash
# Start containers
docker-compose up -d

# Create public URL
lt --port 80 --subdomain keyboardwarrior

# Stop everything
docker-compose down
```

## 🔧 Alternative Tunneling Options

### If LocalTunnel is slow, try these:

#### Option 1: Telebit (No password required)
```bash
# Install
npm install -g telebit

# Run
telebit http 80
```

#### Option 2: Serveo (No install needed)
```bash
ssh -R 80:localhost:80 serveo.net
```

#### Option 3: Bore (Simple & fast)
```bash
# Download from https://github.com/ekzhang/bore/releases
bore local 80 --to bore.pub
```

## 📊 Current Status

✅ **Docker containers:** Running  
✅ **Frontend:** http://localhost  
✅ **Backend API:** http://localhost:5000  
✅ **Public URL:** https://keyboardwarrior.loca.lt  

## 🎮 What Your Friends Can Do:

1. **Create arguments** with different tones
2. **Get AI-powered responses** (using your OpenAI API key)
3. **Have real-time debates**
4. **Save their argument history** (stored locally in their browser)

## ⚠️ Important Notes:

- **Bandwidth:** Your internet upload speed affects performance
- **Security:** Anyone with the URL can access the app
- **API Usage:** All AI requests use YOUR OpenAI API key
- **Uptime:** App is only available while your computer is on
- **Firewall:** Windows Defender may ask for permission (allow it)

## 🛡️ Security Tips:

1. **Monitor usage** - Check Docker logs for activity
2. **Set limits** - Configure rate limiting if needed
3. **Stop when done** - Run `stop-sharing.bat` when finished
4. **Change subdomain** - Use different subdomain each session

## 📈 Performance Tips:

- **Good for:** 5-10 simultaneous users
- **Internet speed:** Need at least 5 Mbps upload
- **Best experience:** Friends should have stable internet

## 🆘 Troubleshooting:

### "Connection refused" error:
```bash
# Check if Docker is running
docker ps

# Restart containers
docker-compose restart
```

### Slow performance:
- Check your internet upload speed
- Reduce number of concurrent users
- Try alternative tunnel service

### Friends can't connect:
1. Make sure you're still running the tunnel
2. Check Windows Firewall settings
3. Try a different subdomain

## 📞 Share Instructions with Friends:

Send them this message:
```
Hey! Check out my Keyboard Warrior app:
https://keyboardwarrior.loca.lt

When you visit:
1. You'll see a password on the screen
2. Enter that password
3. Click "Click to Continue"
4. Start arguing! 💬⚔️
```

---

**Your app is live and ready to share!** 🎉

Friends can now access your Keyboard Warrior app from anywhere in the world!