const child_process = require("child_process");
const fs = require("fs");
const path = require("path");

async function includeTestFolder() {
  // create link src/test-tmp/ -> src/test/ (and then let the build go and rename
  // target/dist*/test-tmp/ back to test/)
  console.log("Making sure uu5g04-test test/ folder gets processed by devkit.");
  if (process.platform === "win32") {
    child_process.spawnSync("mklink", ["/J", "test-tmp", path.join("test")], {
      shell: true,
      stdio: ["ignore", "ignore", "inherit"],
      cwd: path.resolve("src"),
    });
  } else if (process.platform === "darwin") {
    // MacOS
    child_process.spawnSync("ln", ["-s", path.join("test"), "test-tmp"], {
      shell: true,
      stdio: ["ignore", "ignore", "inherit"],
      cwd: path.resolve("src"),
    });
  } else if (process.platform === "linux") {
    child_process.spawnSync("ln", ["-s", path.join("test"), "test-tmp"], {
      shell: true,
      stdio: ["ignore", "ignore", "inherit"],
      cwd: path.resolve("src"),
    });
  } else {
    console.warn("Linking test/ folder is not implemented for this OS yet.");
  }
}

async function run() {
  if (!process.env.WATCH) await includeTestFolder();

  // ensure that uu5g05 is in externals (in case we performed build previously and terminated it
  // via Ctrl+C midway)
  let pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
  if (!pkg.uuBuildSettings.externals.uu5g05) {
    pkg.uuBuildSettings.externals.uu5g05 = "Uu5g05";
    fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n", "utf-8");
  }
}

run();
