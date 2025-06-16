<div class="container mx-auto p-4">
  <h1 class="text-3xl font-bold mb-4">CLI Documentation</h1>

  <section class="mb-8">
    <h2 class="text-2xl font-semibold mb-2">Introduction</h2>
    <p>
      Welcome to the command-line interface (CLI) documentation. This tool helps you manage your project efficiently.
    </p>
  </section>

  <section class="mb-8">
    <h2 class="text-2xl font-semibold mb-2">Installation</h2>
    <p>
      To use the CLI, you first need to install it globally via npm (or your preferred package manager):
    </p>
    <pre class="bg-gray-100 p-2 rounded"><code>npm install -g your-cli-package-name</code></pre>
    <p class="mt-2">
      Alternatively, you can run it directly using npx without global installation:
    </p>
    <pre class="bg-gray-100 p-2 rounded"><code>npx your-cli-package-name &lt;command&gt;</code></pre>
  </section>

  <section class="mb-8">
    <h2 class="text-2xl font-semibold mb-2">Usage</h2>
    <p>
      The basic syntax for using the CLI is:
    </p>
    <pre class="bg-gray-100 p-2 rounded"><code>your-cli-package-name &lt;command&gt; [options]</code></pre>
  </section>

  <section class="mb-8">
    <h2 class="text-2xl font-semibold mb-2">Available Commands</h2>

    <div class="mb-4 p-4 border rounded">
      <h3 class="text-xl font-medium"><code>init</code></h3>
      <p class="mt-1">Initializes a new project or sets up the CLI in an existing project.</p>
      <pre class="bg-gray-100 p-2 mt-2 rounded"><code>your-cli-package-name init [project-name]</code></pre>
    </div>

    <div class="mb-4 p-4 border rounded">
      <h3 class="text-xl font-medium"><code>build</code></h3>
      <p class="mt-1">Builds your project for production.</p>
      <pre class="bg-gray-100 p-2 mt-2 rounded"><code>your-cli-package-name build [--output path/to/output]</code></pre>
    </div>

    <div class="mb-4 p-4 border rounded">
      <h3 class="text-xl font-medium"><code>serve</code></h3>
      <p class="mt-1">Serves your project locally for development.</p>
      <pre class="bg-gray-100 p-2 mt-2 rounded"><code>your-cli-package-name serve [--port 3000]</code></pre>
    </div>

    <div class="mb-4 p-4 border rounded">
      <h3 class="text-xl font-medium"><code>deploy</code></h3>
      <p class="mt-1">Deploys your project to a specified environment.</p>
      <pre class="bg-gray-100 p-2 mt-2 rounded"><code>your-cli-package-name deploy [--target production]</code></pre>
    </div>
  </section>

  <section>
    <h2 class="text-2xl font-semibold mb-2">Global Options</h2>
    <ul class="list-disc pl-5">
      <li><code>--help</code> - Show help information for a command.</li>
      <li><code>--version</code> - Display CLI version.</li>
      <li><code>--verbose</code> - Enable verbose output.</li>
    </ul>
  </section>
</div>
