# 📝 Team Commit Convention (TCC)

This document was created exclusively due to the lack of rules and commit structures across our team environment. A clean, searchable, and standardized Git history is essential for the entire team to track progress, debug issues, and understand project evolution. 

All team members must strictly follow these guidelines before pushing code.

## ⏱️ Official Repository Timestamp
This document serves as the official temporal record for Foxwell Collective Interactive. 
**The repository was officially created on September 23, 2026, at 17:00 UTC-4.**

## 📐 Core Structure

Every commit message must follow this exact format, always written entirely in English:

`type(scope): Following the TCC. detailed description in lowercase`

The `scope` (optional but recommended) indicates the specific file, page, or system being modified. The phrase **"Following the TCC."** is strictly mandatory and must be the very first thing written in the description block.

## 🚫 The Plain Text Mandate

Git terminal logs do not render Markdown. For this reason, **do not use Markdown formatting inside the commit message itself**. 
* ❌ Avoid: `feat: Following the TCC. add **new** login system`
* ❌ Avoid: `fix: Following the TCC. bullet points \n - item 1 \n - item 2`
* ✅ Use plain text, spacing, and simple punctuation to separate ideas.

## 🏷️ Approved Commit Types

We are expanding beyond the basic standard to accurately reflect our specific development cycle. Use the appropriate tag for your work:

* ✨ **feat**: Introduction of a brand new feature or system.
* 🐛 **fix**: Patching a bug, error, or unexpected behavior.
* 🎨 **ui**: Purely visual changes, CSS adjustments, animations, and frontend polish.
* 🔐 **sec**: Security implementations, data encryption, or vulnerability patches.
* ⚙️ **config**: Modifications to environment variables, server settings, or package managers.
* 📦 **db**: Database migrations, schema updates, or data structure shifts.
* 📝 **docs**: Creation or updates to documentation (like this exact file).
* ♻️ **refactor**: Rewriting or optimizing existing code without changing its external behavior.
* 🚀 **deploy**: Releases, builds, or pushing to production servers.
* 🗑️ **drop**: Complete removal of deprecated files, unused assets, or dead code.

## 🛡️ Code File Structure & Protection

The TCC also strictly dictates how code files must be structured. Every source code file must include a specific header and footer to protect our intellectual property.

### Mandatory Header
Must be placed at the absolute top of every file (HTML, CSS, JS) as a comment block:
File Name: [filename]
Purpose: [brief description]
Owner: Foxwell Collective Interactive (Foxwell Games)
Copyright: All rights reserved. Codes, IPs, contents, and studio materials are strictly protected under international copyright and intellectual property laws.

### Mandatory Footer
Must be placed at the absolute bottom of every file as a comment block:
Terms of Use: The codes provided herein may be modified strictly for personal use. They cannot be shared, distributed, or presented illegally as if they were the property of someone else, in accordance with the accepted terms of Foxwell Collective Interactive.
