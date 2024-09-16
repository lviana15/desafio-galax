// src/models/importStatus.js
import mongoose from 'mongoose';

const ImportStatusSchema = new mongoose.Schema({
    imported: { type: Boolean, default: false },
});

const ImportStatus = mongoose.model('ImportStatus', ImportStatusSchema);

export default ImportStatus;

