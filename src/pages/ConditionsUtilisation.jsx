function ConditionsUtilisation() {
  return (
    <div className="card">
      <h2>Conditions d'utilisation</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Dernière mise à jour : août 2026</p>

      <h3>1. Objet</h3>
      <p>
        SunuKeur est une plateforme de mise en relation entre propriétaires et personnes à la recherche
        d'un logement à Dakar. SunuKeur n'est pas partie aux contrats de location conclus entre utilisateurs.
      </p>

      <h3>2. Inscription et compte</h3>
      <p>
        La publication d'une annonce nécessite la création d'un compte propriétaire. Lors de la
        publication, le publicateur indique son statut (propriétaire, mandataire, ou membre de la
        famille autorisé) et signe une déclaration sur l'honneur certifiant être autorisé à publier
        l'annonce. Toute fausse déclaration peut entraîner la suspension du compte et le retrait des
        annonces concernées.
      </p>

      <h3>3. Vérification des annonces</h3>
      <p>
        Chaque annonce est examinée par notre équipe avant publication, ce qui peut inclure un appel
        téléphonique de vérification. SunuKeur se réserve le droit de demander un justificatif
        complémentaire en cas de doute, de refuser, ou de retirer toute annonce ne respectant pas ces
        conditions, sans préavis.
      </p>

      <h3>4. Obligations de l'utilisateur</h3>
      <ul>
        <li>Fournir des informations exactes et à jour</li>
        <li>Ne publier que des annonces correspondant à des logements réels dont vous êtes propriétaire, mandaté, ou membre de la famille autorisé</li>
        <li>Ne pas utiliser la plateforme à des fins frauduleuses</li>
        <li>Respecter les autres utilisateurs dans vos échanges</li>
      </ul>

      <h3>5. Rôle de SunuKeur</h3>
      <p>
        SunuKeur facilite la mise en relation entre propriétaires et locataires et vérifie les annonces
        publiées, mais ne garantit pas la conclusion d'une location ni l'exactitude absolue de toutes les
        informations fournies par les utilisateurs. Chaque utilisateur reste responsable de vérifier les
        informations avant de s'engager.
      </p>

      <h3>6. Limitation de responsabilité</h3>
      <p>
        SunuKeur ne peut être tenu responsable des litiges survenant entre propriétaires et locataires
        dans le cadre d'une location conclue via la plateforme.
      </p>

      <h3>7. Suppression de compte</h3>
      <p>
        Vous pouvez supprimer votre compte à tout moment depuis "Mon espace". Cette action est
        définitive et entraîne la suppression de votre profil ainsi que de toutes vos annonces.
      </p>

      <h3>8. Modification des conditions</h3>
      <p>
        Ces conditions peuvent évoluer. Les utilisateurs seront informés de tout changement important.
      </p>
    </div>
  );
}

export default ConditionsUtilisation;