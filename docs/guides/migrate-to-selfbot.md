# Guide de migration : discord-html-transcripts → spectre-html-transcripts (Selfbot v13)

Ce guide décrit les modifications requises pour porter le projet original `discord-html-transcripts` vers une version adaptée aux selfbots utilisant `discord.js-selfbot-v13` (v3.7.1).

## 1. Problèmes principaux
- Les API et enums ont changé entre `discord.js` (v14+) et `discord.js-selfbot-v13` (v3.x). Exemple : `ChannelType` (numeric enums) vs types string (`'GUILD_TEXT'`, `'DM'`, ...).
- Certains helpers comme `.isTextBased()` ou `.isDMBased()` peuvent manquer ou se comporter différemment en v13.
- Les assets (images) dans les DMs requièrent souvent le token du selfbot pour être récupérés.

## 2. Étapes appliquées dans cette fourche
1. Remplacement des imports `discord.js` → `discord.js-selfbot-v13` dans les fichiers TypeScript.
2. Ajout d'un petit adaptateur `src/utils/djsAdapter.ts` qui expose :
   - `isTextBasedChannel(channel)`
   - `isDMBasedChannel(channel)`
   - `isThreadChannel(channel)`
   - `isVoiceBasedChannel(channel)`
   - `getChannelTypeFrom(type)`

   Ces helpers acceptent à la fois les objets v14 (énum numériques) et v13 (string).

3. Support des images privées : `src/downloader/images.ts` expose `withToken(token)` et inclut le header `Authorization` si un token est fourni. Lorsque `saveImages` est activé et qu'aucun `resolveImageSrc` personnalisé n'est fourni, le downloader par défaut utilisera `channel.client.token` s'il existe.

4. Adaptation de `createTranscript` pour valider les canaux texte via l'adapter au lieu de `channel.isTextBased()` direct.

5. Documentation et exemples mis à jour pour utiliser `spectre-html-transcripts` et inciter à installer `discord.js-selfbot-v13@^3.7.1`.

## 3. Conseils d'utilisation
- Préférez fournir vous-même `resolveImageSrc` si vous avez des contraintes de stockage. Le downloader par défaut encodera les images en base64 (sauf si vous fournissez un autre URL).
- Par défaut, dans cette fourche, `saveImages` est activé pour éviter la perte d'assets privés dans les DMs.

## 4. Limitations et notes
- Cette fourche n'est pas une réécriture complète du moteur de rendu React ; elle fournit un pont (via l'adapter) afin de minimiser les changements dans le code de rendu.
- Typescript peut nécessiter l'installation de `@types` et des dépendances (React, undici, sharp, etc.) pour la compilation locale.
- L'utilisation de selfbots peut violer les Conditions d'utilisation de Discord. N'utilisez cela qu'à vos risques et périls.

---

Si vous voulez que je pousse ces changements dans un dépôt séparé (nouveau repo GitHub), je peux préparer un README de publication et un changelog. Voulez-vous que je le fasse ?