const { getDB } = require('../config/mongodb');

async function caricaDati() {
    try {
        const db = getDB();
        const famiglie = await db.collection('famiglie').find({}).toArray();
        const history = await db.collection('history').find({}).sort({ timestamp: -1 }).toArray();
        const configDocs = await db.collection('config').find({}).toArray();

        const configObj = {};
        configDocs.forEach(doc => {
            configObj[doc.key] = doc.value;
        });

        const famigliObj = {};
        famiglie.forEach(doc => {
            famigliObj[doc.id_ruolo] = {
                nome: doc.nome,
                totale: doc.totale,
                prezzoTotale: doc.prezzo_totale
            };
        });

        return {
            famiglie: famigliObj,
            config: {
                pulizia_logs_channel: configObj.pulizia_logs_channel || null,
                classifica_logs_channel: configObj.classifica_logs_channel || null,
                backup_channel: configObj.backup_channel || null
            },
            history: history
        };
    } catch (error) {
        console.error('Error loading data:', error);
        return { famiglie: {}, config: { pulizia_logs_channel: null, classifica_logs_channel: null, backup_channel: null }, history: [] };
    }
}

async function salvaDati(dati) {
    try {
        const db = getDB();
        await db.collection('famiglie').deleteMany({});
        const famiglieDocs = Object.entries(dati.famiglie).map(([idRuolo, info]) => ({
            id_ruolo: idRuolo,
            nome: info.nome,
            totale: info.totale,
            prezzo_totale: info.prezzoTotale
        }));
        
        if (famiglieDocs.length > 0) {
            await db.collection('famiglie').insertMany(famiglieDocs);
        }
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

async function salvaConfig(key, value) {
    try {
        const db = getDB();
        await db.collection('config').updateOne(
            { key: key },
            { $set: { key: key, value: value } },
            { upsert: true }
        );
    } catch (error) {
        console.error('Error saving config:', error);
    }
}

async function caricaBackupState() {
    try {
        const db = getDB();
        const result = await db.collection('config').findOne({ key: 'backup_state' });
        if (result) {
            return JSON.parse(result.value);
        }
    } catch (error) {
        console.error('Error loading backup state:', error);
    }
    return { lastBackupTime: 0, lastBackupMessageId: null };
}

async function salvaBackupState(state) {
    try {
        const db = getDB();
        await db.collection('config').updateOne(
            { key: 'backup_state' },
            { $set: { key: 'backup_state', value: JSON.stringify(state) } },
            { upsert: true }
        );
    } catch (error) {
        console.error('Error saving backup state:', error);
    }
}

module.exports = { caricaDati, salvaDati, salvaConfig, caricaBackupState, salvaBackupState };
