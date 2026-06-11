rootProject.name = "CombinedCloudstreamPlugins"

// Automatically includes every subdirectory that has a build.gradle.kts.
// Folders listed in `disabled` are skipped.
// The stremio-addon folder is a Node.js project and is excluded here.

val disabled = listOf<String>(
    "stremio-addon",
    "gradle"
)

File(rootDir, ".").eachDir { dir ->
    if (!disabled.contains(dir.name) && File(dir, "build.gradle.kts").exists()) {
        include(dir.name)
    }
}

fun File.eachDir(block: (File) -> Unit) {
    listFiles()?.filter { it.isDirectory }?.forEach { block(it) }
}

// To build only a single plugin, comment out the block above and uncomment:
// include("PluginName")
