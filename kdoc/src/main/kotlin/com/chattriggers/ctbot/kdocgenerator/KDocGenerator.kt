package com.chattriggers.ctbot.kdocgenerator

import com.copperleaf.kodiak.kotlin.KotlindocInvokerImpl
import com.copperleaf.kodiak.kotlin.models.KotlinModuleDoc
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import org.eclipse.jgit.api.Git
import org.slf4j.LoggerFactory
import java.io.File
import java.io.OutputStream
import java.io.PrintStream
import java.nio.file.Files
import java.util.logging.Level
import java.util.logging.Logger

object KDocGenerator {
    private val TARGET_DIR = File("./out")
    private val REPO_DIR = File(TARGET_DIR, "repo")
    private val DOKKA_DIR = File(TARGET_DIR, "dokka")
    private val JSON_DIR = File("./dist")
    private const val REPO = "https://github.com/ChatTriggers/ct.js.git"

    @JvmStatic
    fun main(args: Array<String>) {
        if (!shouldRebuildSearchTerms()) {
            println("[KDoc] local repo is the same as remote, not rebuilding search terms")
            return
        }

        println("[KDoc] cloning repo")
        cloneRepo()
        println("[KDoc] building search terms")
        val terms = getSearchTerms()
        val json = Json.Default.encodeToString(terms)

        println("[KDoc] writing to json")
        JSON_DIR.mkdirs()
        val jsonFile = File(JSON_DIR, "terms.json")
        jsonFile.writeText(json)
        println("[KDoc] done building search terms")
    }

    private fun shouldRebuildSearchTerms(): Boolean {
        if (!REPO_DIR.exists())
            return true

        return doGitOp {
            val repo = Git.open(REPO_DIR)

            val localHead = repo.repository.findRef("HEAD")
            val remoteHead = Git.lsRemoteRepository().setRemote(REPO).call().find { it.name == "HEAD" }!!
            localHead.objectId != remoteHead.objectId
        }
    }

    private fun cloneRepo() {
        if (REPO_DIR.exists())
            REPO_DIR.deleteRecursively()

        doGitOp {
            Git.cloneRepository()
                .setURI(REPO)
                .setBranchesToClone(listOf("refs/heads/master"))
                .setBranch("refs/heads/master")
                .setDirectory(REPO_DIR)
                .call()
        }
    }

    private fun getDocs(): KotlinModuleDoc {
        val cacheDir = Files.createTempDirectory("dokkaCache")
        val runner = KotlindocInvokerImpl(cacheDir)

        if (DOKKA_DIR.exists()) {
            DOKKA_DIR.deleteRecursively()
            DOKKA_DIR.mkdirs()
        }

        /*
        ERROR: error: source file or directory not found: /home/matthew/code/ctbot-ts/kdoc/./out/repo/ctjs/src/main/kotlin
         */

        return runner.getModuleDoc(
            listOf(File(REPO_DIR, "src/main/kotlin").toPath()),
            DOKKA_DIR.toPath()
        ) {
            Runnable {
                it.bufferedReader().readText()
            }
        } ?: throw IllegalStateException("oops")
    }

    private fun getSearchTerms(): List<SearchTerm> {
        val docs = getDocs()
        val terms = mutableListOf<SearchTerm>()

        docs.classes.filter { it.modifiers.isPublicMember() }.forEach { clazz ->
            val name = clazz.id.replace("${clazz.`package`}.", "")
            val pkg = clazz.`package`.replace('.', '/')

            val urlBase = "https://chattriggers.com/javadocs/$pkg/$name.html"

            terms.add(SearchTerm(
                clazz.name,
                urlBase,
                "${clazz.kind.lowercase()} $name"
            ))

            clazz.fields.filter { it.modifiers.isPublicMember() }.forEach { field ->
                terms.add(SearchTerm(
                    field.name,
                    "$urlBase#${field.name}",
                    "field ${field.name}"
                ))
            }

            clazz.methods.filter { it.modifiers.isPublicMember() }.forEach { method ->
                val url = buildString {
                    append(urlBase)
                    append("#${method.name}-")

                    if (method.receiver != null)
                        append(":Dreceiver-")

                    append(method.parameters.joinToString("-") { it.name })
                    append('-')
                }

                val originalReturnValue = method.returnValue.name
                val returnType = when {
                    originalReturnValue.startsWith("apply {") -> name
                    originalReturnValue == "()" -> "Unit"
                    else -> method.returnValue.signature.joinToString("") { it.text }
                }

                val descriptor = buildString {
                    append(clazz.name)

                    when (clazz.kind) {
                        "Object", "Enum" -> append(".")
                        "Class", "Interface" -> append("#")
                        else -> throw IllegalStateException("Unrecognized class kind: ${clazz.kind}")
                    }

                    append(method.name)
                    append("(")

                    method.parameters.joinToString {
                        it.signature.joinToString("") { c -> c.text }
                    }.run(::append)

                    append("): ")
                    append(returnType)
                }

                terms.add(SearchTerm(
                    method.name,
                    url,
                    descriptor
                ))
            }
        }

        return terms
    }

    // slf4j is garbage
    private inline fun <T> doGitOp(crossinline block: () -> T): T {
        val out = System.out
        System.setOut(PrintStream(object : OutputStream() {
            override fun write(p0: Int) {}
        }))
        val result = block()
        System.setOut(out)

        return result
    }

    private fun List<String>.isPublicMember() = !contains("internal") && !contains("private")

    @Serializable
    data class SearchTerm(
        val name: String,
        val url: String,
        val descriptor: String
    )
}