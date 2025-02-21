
//Usuários
routes.get("/usuarios", async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM "USERS"');
        res.json(result.rows);
        res.status(200).json(result.rows);
        console.log("Consulta realizada com sucesso!")
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar usuários" });
        console.log("Erro ao buscar usuários.")
      }
  });
