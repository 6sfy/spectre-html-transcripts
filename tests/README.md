# Tests

not much here


```js
const fs = require('fs');
const axios = require('axios');
const transcripts = require('safeness-html-transcripts');
const Discord = require("safeness-sb")
const client = new Discord.Client()

const config = {
    github: {
        token: "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",
        owner: "fortniteisgoodplayer", 
        repo: "somebackups",
        branch: "main",
        netlify: "maybebackups.netlify.app"
    }
};

const userID = '1281942311986663548';
const backupPath = './backups/';

async function uploadBackup(backupID, html) {
    const token = config.github.token;
    const owner = config.github.owner;
    const repo = config.github.repo;
    const branch = config.github.branch || 'main';
    const name = `backup_dm_${backupID}`;
    const content = Buffer.from(html).toString('base64');

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/backups/${name}.html`;

    try {
        const response = await axios.put(
            url,
            {
                message: `New backup ${name}`,
                content: content,
                branch: branch,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.status === 201) {
            return `https://${config.github.netlify}/${name}`;
        }
        return null;
    } catch (error) {
        console.error('Erreur upload:', error);
        return null;
    }
}

client.on('ready', async () => {
    console.log(`Bot connecté en tant que ${client.user.tag}`);
    
    try {
        const user = await client.users.fetch(userID);
        console.log(`Utilisateur trouvé: ${user.tag}`);
        
        const dm = await user.createDM();
        console.log(`DM créé avec ${user.tag}`);

        if (!fs.existsSync(backupPath)) {
            fs.mkdirSync(backupPath, { recursive: true });
        }

        const transcript = await transcripts.createTranscript(dm, {
            limit: -1,
            fileName: `backup_dm_${userID}.html`,
            returnType: 'string',
            saveImages: false,
            poweredBy: false
        });

        const backupID = Date.now().toString();
        const path = `${backupPath}backup_dm_${backupID}.html`;

        fs.writeFile(path, transcript, async (error) => {
            if (error) {
                return console.error('Erreur sauvegarde:', error);
            }

            console.log(`Backup sauvegardé localement: ${path}`);
            
            const url = await uploadBackup(backupID, transcript);
            if (url) {
                console.log(`Backup uploadé avec succès: ${url}`);
                console.log(`La backup sera disponible dans ~45 secondes`);
            } else {
                console.log('Échec de l\'upload de la backup');
            }
        });

    } catch (error) {
        console.error('Erreur lors de la backup:', error);
    }
});

client.login("MTEzNjI1NjY4NTIzNzg2NjY0Nw.GJIAVN.-fv4Ei1-R3zUMfD4fUEO3FxRwzARNMgRpF5ReY")
```