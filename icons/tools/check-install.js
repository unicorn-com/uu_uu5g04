// uu5-library-1.7.0
var fs = require("fs");
var path = require("path");
var child_process = require("child_process");

// if node_modules/ doesn't exist, run "npm install"
if (!fs.existsSync("node_modules")) {
  console.log("Folder node_modules/ doesn't exist - running 'npm install' in", path.resolve("."));
  var proc = child_process.spawn("npm", ["install"], { shell: true, cwd: path.resolve("."), stdio: "inherit" });
  proc.on("exit", function (code) {
    process.exit(code);
  });
}
