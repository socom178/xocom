<?php
/* =============================================
   XOCOM WEB AGENCY — Traitement formulaire
============================================= */

// ---- Configuration ----
$destinataire = "socomwebagency@gmail.com";   // <- ton email
$sujet_prefix = "[Xocom] Nouvelle demande de devis";

// ---- Sécurité : autoriser uniquement les requêtes POST ----
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405);
  exit("Méthode non autorisée.");
}

// ---- Fonction de nettoyage des données ----
function nettoyer($data) {
  return htmlspecialchars(strip_tags(trim($data)));
}

// ---- Récupération et nettoyage des champs ----
$nom         = nettoyer($_POST["nom"]         ?? "");
$mail        = nettoyer($_POST["mail"]        ?? "");
$phone       = nettoyer($_POST["phone"]       ?? "Non renseigné");
$entreprise  = nettoyer($_POST["ename"]       ?? "Non renseignée");
$type        = nettoyer($_POST["type"]        ?? "Non précisé");
$budget      = nettoyer($_POST["budget"]      ?? "Non précisé");
$description = nettoyer($_POST["description"] ?? "");

// ---- Validation des champs obligatoires ----
$erreurs = [];

if (empty($nom))         $erreurs[] = "Le nom est obligatoire.";
if (empty($mail))        $erreurs[] = "L'email est obligatoire.";
if (!filter_var($mail, FILTER_VALIDATE_EMAIL)) $erreurs[] = "L'email n'est pas valide.";
if (empty($description)) $erreurs[] = "La description du projet est obligatoire.";

// ---- Si erreurs → réponse JSON ----
if (!empty($erreurs)) {
  header("Content-Type: application/json");
  echo json_encode(["success" => false, "erreurs" => $erreurs]);
  exit;
}

// ---- Construction de l'email ----
$sujet = $sujet_prefix . " — " . $type;

$corps = "
====================================================
   NOUVELLE DEMANDE DE DEVIS — XOCOM WEB AGENCY
====================================================

👤 CONTACT
   Nom complet   : $nom
   Email         : $mail
   Téléphone     : $phone
   Entreprise    : $entreprise

📋 PROJET
   Type          : $type
   Budget estimé : $budget

📝 DESCRIPTION
$description

====================================================
Date de réception : " . date("d/m/Y à H:i") . "
====================================================
";

// ---- En-têtes de l'email ----
$headers  = "From: Xocom Web Agency <noreply@xocomwebagency.com>\r\n";
$headers .= "Reply-To: $mail\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// ---- Envoi ----
$envoye = mail($destinataire, $sujet, $corps, $headers);

// ---- Email de confirmation au client ----
if ($envoye) {
  $sujet_client = "✅ Votre demande a bien été reçue — Xocom Web Agency";
  $corps_client = "
Bonjour $nom,

Merci pour votre demande de devis. Nous avons bien reçu votre message.

Votre projet : $type
Budget       : $budget

Notre équipe vous contactera dans les 24 heures ouvrées.

Cordialement,
L'équipe Xocom Web Agency
📧 socomwebagency@gmail.com
📞 +229 01 42 68 05 37
🌐 Cotonou, Bénin
  ";

  $headers_client  = "From: Xocom Web Agency <noreply@xocomwebagency.com>\r\n";
  $headers_client .= "Content-Type: text/plain; charset=UTF-8\r\n";

  mail($mail, $sujet_client, $corps_client, $headers_client);
}

// ---- Réponse JSON pour le JavaScript ----
header("Content-Type: application/json");
echo json_encode([
  "success" => $envoye,
  "message" => $envoye
    ? "Votre demande a été envoyée ! Nous vous répondrons sous 24h."
    : "Une erreur est survenue. Veuillez réessayer ou nous contacter directement."
]);
