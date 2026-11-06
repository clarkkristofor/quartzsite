A quick judgment and open-ended writing are different jobs, so they shouldn't automatically go to the same model. For your Ollama setup, that turns into five habits.

**1. Sort each task into "decide" or "write."**

- **Decide** means the answer comes from a list you set: yes/no, a category, a score. The feed splitter, the HA command bot's choice of which device you meant, and inbox triage are all decide tasks.
- **Write** means the answer is open-ended prose: the weekly health report, kid tutor chat, summaries.
- Decide tasks can run on much smaller models. Write tasks are where `qwen3:8b` or bigger earns its spot.

**2. Give decide tasks the Jev treatment.**

- Ask one narrow question at a time, and combine the answers with a rule in your script.
- Limit the output to your fixed list of answers, which Ollama can enforce.
- Turn thinking off and set temperature to 0. A gut-check question doesn't need reasoning, and these settings make the answers faster and repeatable.
- If you want a "maybe" pile, read the probabilities (Ollama 0.12+) rather than taking only the top answer.

**3. Try the smallest model that passes a test.**  
Collect about 20 real examples with the answers you'd give, like Kottke titles you've labeled politics or not. Run them through `qwen3:4b` or smaller before reaching for 8B. If the small one matches you, use it. It's faster and leaves room on the 2060's 8 GB of video memory.

**4. Use purpose-built models where they exist.**  
You're already doing this with Whisper for sermon transcription, a model built for exactly that one job. Embedding models like `nomic-embed-text` are the equivalent for "find notes similar to this" searches, such as the sermon archive or the illustration library. They're tiny and much better at that job than asking a chat model.

**5. Escalate when the answer is uncertain.**  
Let the small model handle the confident cases. When its confidence is low, send the item to `qwen3:8b`, Claude, or you. This is the "model routing" use case from the TypeSafe docs, in home-sized form.

**How your projects map:**

|Task|Type|Model approach|
|---|---|---|
|Feed splitter (#20)|Decide|One yes/no question to a small model, list-limited answers, thinking off|
|HA command bot|Decide, then act|Keep `qwen3:8b` for tool calling, but test a smaller model on your common commands|
|Weekly health report|Write|`qwen3:8b`|
|Kid tutor / chat bot|Write|`qwen3:8b` or the biggest model that fits|
|Sermon transcription|Specialized|Whisper|
|Sermon or notes search|Specialized|Embedding model|

The 8 GB card is the practical reason this matters. A small classifier can share the card with Whisper or another model, while two 8B models can't run at the same time.