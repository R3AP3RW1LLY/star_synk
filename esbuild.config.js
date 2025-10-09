import esbuild from "esbuild";

const args = process.argv.slice(2);
const isWatchMode = args.includes("--watch");

const options = {
  entryPoints: ["app/javascript/application.js"],
  bundle: true,
  sourcemap: true,
  outdir: "app/assets/builds",
  publicPath: "/assets",
  logLevel: "info",
};

async function build() {
  if (isWatchMode) {
    const ctx = await esbuild.context(options);
    console.log("🔁 Esbuild watching for changes...");
    await ctx.watch();
  } else {
    await esbuild.build(options);
    console.log("✅ Esbuild build complete");
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
