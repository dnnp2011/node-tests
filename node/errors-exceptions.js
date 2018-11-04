const path = require('path');
const fs = require('fs');
const framePrint = require('../console-frame-print');

const files = ['.bashrc', '', '.npmrc'];

files.forEach(file => {
   try {
       const filePath = path.resolve(process.env.HOME, file);
       const data = fs.readFileSync(filePath, 'utf-8');
       console.log('\r\nFile data: %s', data);
   } catch (e){
       switch (e.code) {
           case 'ENOENT':
               console.warn('The file \'%s\' was not found...', file);
               break;
           case 'EISDIR':
               console.warn('Performing a read operation on directory \'%s\'...', file);
               break;
           default:
               framePrint('Halting execution');
               throw e;
       }
   }
});