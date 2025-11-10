/**
 * Script to create all test users with OWASP-compliant passwords
 */

const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

const SALT_ROUNDS = 12;

const TEST_USERS = {
  admins: [
    { email: 'gerente@cafe.com', password: 'G3r3nt3!2025.Macchiato_Boss', nombre: 'Roberto Martínez - Gerente' },
    { email: 'supervisor@cafe.com', password: 'Sup3rv!sor#2025.Frappe_Top', nombre: 'Ana López - Supervisora' },
    { email: 'admin.it@cafe.com', password: 'AdminIT!2025.Mocha_Secure@', nombre: 'Carlos Tech - Admin TI' },
    { email: 'admin.backup@cafe.com', password: 'B@ckup!Admin#2025.Latte!', nombre: 'María Sánchez - Admin Respaldo' },
  ],
  empleados: [
    { email: 'cajero@cafe.com', password: 'C@j3r0!2025.Cappuccino_Pay', nombre: 'Pedro Ramírez - Cajero' },
    { email: 'barista.noche@cafe.com', password: 'B@r!st@Night#2025.Dark_Roast', nombre: 'Sofía Mendoza - Barista Nocturno' },
    { email: 'inventario@cafe.com', password: 'Inv3nt@rio!2025.Stock_Pro@', nombre: 'Luis Torres - Encargado Inventario' },
    { email: 'repostero@cafe.com', password: 'R3p0st3r0#2025.Pastry_Chef!', nombre: 'Carmen Flores - Repostera' },
  ],
  clientes: [
    { email: 'cliente.vip@cafe.com', password: 'Cl!ent3VIP#2025.Gold_Member!', nombre: 'Laura Jiménez - Cliente VIP' },
    { email: 'nuevo.cliente@cafe.com', password: 'Nu3v0!Client3#2025.First_Order@', nombre: 'Diego Vargas - Cliente Nuevo' },
    { email: 'cliente.corp@cafe.com', password: 'C0rp!Client#2025.Office_Orders!', nombre: 'Empresa TechCorp - Cliente Corporativo' },
    { email: 'estudiante@cafe.com', password: 'Estud!@nt3#2025.Study_Fuel!', nombre: 'Andrea Ruiz - Estudiante' },
  ]
};

const ROLE_IDS = { admins: 1, empleados: 2, clientes: 3 };

async function createTestUsers() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    console.log('✅ Conectado a la base de datos\n');
    console.log('═══════════════════════════════════════════════════');
    console.log('    CREANDO USUARIOS DE PRUEBA - SISTEMA CAFETERÍA');
    console.log('═══════════════════════════════════════════════════\n');

    let totalCreated = 0;
    let totalSkipped = 0;

    for (const [roleKey, users] of Object.entries(TEST_USERS)) {
      const roleId = ROLE_IDS[roleKey];
      const roleName = roleKey.toUpperCase();
      
      console.log(`\n📋 ${roleName}:`);
      console.log('─'.repeat(50));

      for (const user of users) {
        // Check if user exists
        const [existing] = await connection.execute(
          'SELECT id FROM users WHERE email = ?',
          [user.email]
        );

        if (existing.length > 0) {
          console.log(`⚠️  Ya existe: ${user.email}`);
          totalSkipped++;
          continue;
        }

        // Hash password
        const passwordHash = await bcrypt.hash(user.password, SALT_ROUNDS);

        // Create user
        await connection.execute(
          'INSERT INTO users (nombre, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
          [user.nombre, user.email, passwordHash, roleId]
        );

        console.log(`✅ Creado: ${user.email}`);
        console.log(`   Nombre: ${user.nombre}`);
        console.log(`   Password: ${user.password}`);
        totalCreated++;
      }
    }

    console.log('\n═══════════════════════════════════════════════════');
    console.log(`✅ Usuarios creados: ${totalCreated}`);
    console.log(`⚠️  Usuarios ya existentes: ${totalSkipped}`);
    console.log('═══════════════════════════════════════════════════\n');

    // Print summary
    console.log('📊 RESUMEN DE CREDENCIALES:\n');
    
    console.log('ADMINISTRADORES (5):');
    console.log('━'.repeat(70));
    TEST_USERS.admins.forEach(user => {
      console.log(`${user.email.padEnd(30)} / ${user.password}`);
    });

    console.log('\nEMPLEADOS (5):');
    console.log('━'.repeat(70));
    TEST_USERS.empleados.forEach(user => {
      console.log(`${user.email.padEnd(30)} / ${user.password}`);
    });

    console.log('\nCLIENTES (5):');
    console.log('━'.repeat(70));
    TEST_USERS.clientes.forEach(user => {
      console.log(`${user.email.padEnd(30)} / ${user.password}`);
    });

    console.log('\n═══════════════════════════════════════════════════');
    console.log('💡 Ver documentación completa en: docs-dev/USUARIOS_PRUEBA.md');
    console.log('═══════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ER_DUP_ENTRY') {
      console.error('   Posible causa: Usuario duplicado');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('✅ Conexión cerrada\n');
    }
  }
}

createTestUsers();
