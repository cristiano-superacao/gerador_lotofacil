#!/usr/bin/env node
/**
 * Servidor HTTP simples para desenvolvimento local do LotoFácil Estratégica
 * Usage: node server.js [port]
 * Default port: 3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    let pathname = `.${parsedUrl.pathname}`;
    
    // Se é uma pasta, serve o index.html
    if (pathname === './') {
        pathname = './index.html';
    }
    
    // Se não tem extensão, assume que é HTML
    if (!path.extname(pathname)) {
        pathname += '.html';
    }
    
    const ext = path.parse(pathname).ext;
    const contentType = mimeTypes[ext] || 'text/plain';
    
    fs.readFile(pathname, (err, data) => {
        if (err) {
            // Se arquivo não encontrado, serve o index.html (para SPA)
            if (err.code === 'ENOENT') {
                fs.readFile('./index.html', (err, data) => {
                    if (err) {
                        res.statusCode = 404;
                        res.end('Arquivo não encontrado');
                    } else {
                        res.setHeader('Content-Type', 'text/html');
                        res.setHeader('Cache-Control', 'no-cache');
                        res.end(data);
                    }
                });
            } else {
                res.statusCode = 500;
                res.end('Erro interno do servidor');
            }
        } else {
            res.setHeader('Content-Type', contentType);
            res.setHeader('Cache-Control', 'no-cache');
            res.end(data);
        }
    });
});

const port = process.argv[2] || 3000;
const hostname = '127.0.0.1';

server.listen(port, hostname, () => {
    console.log('🚀 LotoFácil Estratégica rodando em:');
    console.log(`   Local:    http://localhost:${port}`);
    console.log(`   Network:  http://${hostname}:${port}`);
    console.log(`   Pasta:    ${process.cwd()}`);
    console.log('\\n📱 Pressione Ctrl+C para parar o servidor');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\\n✅ Servidor parado com sucesso!');
    process.exit(0);
});