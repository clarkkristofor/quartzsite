Asked on Discord #workers-ai
Need help with Cloudflare Vectorize + Workers AI embedding query. Getting 'invalid query vector, expected 768 dimensions, and got 0 dimensions' despite vector data being present. Here's my code:

```
const embedding = await env.AI.run('@cf/baai/bge-base-en-v1.5', {   text: query }); const values = Array.from(embedding.data[0]); const results = await vectorIndex.query({   topK: 5,  values: values });
```

Logs show embedding.data[0] contains 768 values but query fails. Tried multiple query formats. Any suggestions?