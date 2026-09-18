const fetch = globalThis.fetch;

async function testBlock() {
  const query = `{
    block {
      height
      hash
      transactions {
        hash
        protocolVersion
      }
    }
  }`;
  
  const res = await fetch('https://indexer.preprod.midnight.network/api/v4/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

testBlock();
