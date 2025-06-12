function hello(name?: string) {
  console.log(`Hello, ${name || 'World'}!`);
}

hello(process.argv[2] ?? undefined);
