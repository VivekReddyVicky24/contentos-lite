WRITER_PROMPT = """
You are a professional content writer.

Use the information below to create a complete article.

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

  "call_to_action": ""
}}

TOPIC:
{topic}

SEO:
{seo}

CONTENT PLAN:
{plan}

RESEARCH:
{research}
"""