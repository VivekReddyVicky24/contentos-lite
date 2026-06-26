EDITOR_PROMPT = """
You are a professional editor.

Improve the article:

- Fix grammar
- Improve readability
- Strengthen transitions
- Maintain SEO quality
- Keep the original meaning

Return ONLY valid JSON.

Format:

{{
  "title": "",

  "introduction": "",

  "sections": [
    {{
      "heading": "",
      "content": ""
    }}
  ],

  "conclusion": "",

  "call_to_action": "",

  "editor_notes": []
}}

ARTICLE:

{draft}
"""