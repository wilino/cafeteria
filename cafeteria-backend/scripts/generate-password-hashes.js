/**
 * Script para generar hashes bcrypt de las contraseñas de usuarios de prueba
 * 
 * Uso:
 *   node scripts/generate-password-hashes.js
 */

const bcrypt = require('bcrypt');

// Contraseñas de usuarios de prueba
const passwords = {
  admin: 'Adm!n#2025.Cafe_Latte',
  barista: 'B@r1st@#2025.Espresso',
  cliente: 'Cl!ente#2025.Mocha_Safe'
};

console.log('Generando hashes bcrypt para usuarios de prueba...\n');
console.log('='.repeat(80));

async function generateHashes() {
  for (const [role, password] of Object.entries(passwords)) {
    const hash = await bcrypt.hash(password, 10);
    console.log(`\n${role.toUpperCase()}:`);
    console.log(`  Email:    ${role}@cafe.com`);
    console.log(`  Password: ${password}`);
    console.log(`  Hash:     ${hash}`);
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('\nHashes generados exitosamente.');
  console.log('Copia estos hashes al archivo de migración SQL.\n');
}

generateHashes().catch(console.error);
