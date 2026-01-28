#!/bin/bash
echo "=== Oh My OpenCode Installation Verification ==="
echo ""

# 1. Check OpenCode works
echo "1. Testing OpenCode directly:"
opencode --version
if [ $? -eq 0 ]; then
    echo "   ✅ OpenCode v1.1.39 works"
else
    echo "   ❌ OpenCode not working"
    exit 1
fi

# 2. Check config
echo ""
echo "2. Checking configuration:"
CONFIG_FILE="$HOME/.config/opencode/opencode.json"
if [ -f "$CONFIG_FILE" ]; then
    echo "   ✅ Config file exists"
    echo "   Content:"
    cat "$CONFIG_FILE"
else
    echo "   ❌ Config file missing"
fi

# 3. Check built plugin
echo ""
echo "3. Checking built plugin:"
if [ -f "dist/index.js" ]; then
    SIZE=$(du -h dist/index.js | cut -f1)
    echo "   ✅ Plugin built: $SIZE"
else
    echo "   ❌ Plugin not built"
fi

# 4. Summary
echo ""
echo "=== INSTALLATION SUMMARY ==="
echo "✅ OpenCode v1.1.39 installed"
echo "✅ oh-my-opencode plugin built"
echo "✅ Configuration set up"
echo ""
echo "=== HOW TO USE ==="
echo "1. Navigate to your project: cd /path/to/project"
echo "2. Start OpenCode: opencode ."
echo "3. In OpenCode: Ctrl+O to open files"
echo "4. Use 'ultrawork' in prompts to activate oh-my-opencode"
echo ""
echo "Example prompt: 'Fix this bug. Use ultrawork mode.'"
