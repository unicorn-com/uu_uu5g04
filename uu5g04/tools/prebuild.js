const child_process = require("child_process");
const path = require("path");

async function run() {
  // create link src/test-tmp/ -> src/test/ (and then let the build go and rename
  // target/dist*/test-tmp/ back to test/)
  console.log("Making sure uu5g04-test test/ folder gets processed by devkit.");
  if (process.platform === "win32") {
    child_process.spawnSync("mklink", ["/J", "test-tmp", path.join("test")], {
      shell: true,
      stdio: ["ignore", "ignore", "inherit"],
      cwd: path.resolve("src")
    });
  } else if (process.platform === "darwin") {
    // MacOS
    child_process.spawnSync("ln", ["-s", path.join("test"), "test-tmp"], {
      shell: true,
      stdio: ["ignore", "ignore", "inherit"],
      cwd: path.resolve("src")
    });
  } else if (process.platform === "linux") {
    child_process.spawnSync("ln", ["-s", path.join("test"), "test-tmp"], {
      shell: true,
      stdio: ["ignore", "ignore", "inherit"],
      cwd: path.resolve("src")
    });
  } else {
    console.warn("Linking test/ folder is not implemented for this OS yet.");
  }
}

if (!process.env.WATCH) run();
