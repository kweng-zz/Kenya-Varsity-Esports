/**
 * Contentful Migration: Add social media fields to the "article" content type
 *
 * Run with:
 *   npx contentful space migration --space-id <SPACE_ID> --environment-id master migrations/add-author-socials.js
 *
 * Or if you have CONTENTFUL_SPACE_ID set in .env:
 *   npx contentful space migration --space-id $CONTENTFUL_SPACE_ID migrations/add-author-socials.js
 */

module.exports = function (migration) {
  const article = migration.editContentType('article');

  // --- Author Bio ---
  article
    .createField('authorBio')
    .name('Author Bio')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([{ size: { max: 500 } }])
    .disabled(false)
    .omitted(false);

  // --- Twitter / X ---
  article
    .createField('authorTwitter')
    .name('Author Twitter')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([{ size: { max: 100 } }])
    .disabled(false)
    .omitted(false);

  // --- LinkedIn ---
  article
    .createField('authorLinkedIn')
    .name('Author LinkedIn')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([{ size: { max: 256 } }])
    .disabled(false)
    .omitted(false);

  // --- Instagram ---
  article
    .createField('authorInstagram')
    .name('Author Instagram')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([{ size: { max: 100 } }])
    .disabled(false)
    .omitted(false);

  // --- TikTok ---
  article
    .createField('authorTikTok')
    .name('Author TikTok')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([{ size: { max: 100 } }])
    .disabled(false)
    .omitted(false);

  // --- YouTube ---
  article
    .createField('authorYouTube')
    .name('Author YouTube')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([{ size: { max: 256 } }])
    .disabled(false)
    .omitted(false);

  // --- Facebook ---
  article
    .createField('authorFacebook')
    .name('Author Facebook')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([{ size: { max: 256 } }])
    .disabled(false)
    .omitted(false);

  // Move new fields after the existing author-related fields
  article.moveField('authorBio').afterField('author');
  article.moveField('authorTwitter').afterField('authorBio');
  article.moveField('authorLinkedIn').afterField('authorTwitter');
  article.moveField('authorInstagram').afterField('authorLinkedIn');
  article.moveField('authorTikTok').afterField('authorInstagram');
  article.moveField('authorYouTube').afterField('authorTikTok');
  article.moveField('authorFacebook').afterField('authorYouTube');

  // Update the editor interface to group social fields with a heading
  article.changeFieldControl('authorBio', 'builtin', 'multipleLine', {
    helpText: 'Short bio for the author (max 500 chars)',
  });
  article.changeFieldControl('authorTwitter', 'builtin', 'singleLine', {
    helpText: 'Twitter/X handle (e.g. @username or username)',
  });
  article.changeFieldControl('authorLinkedIn', 'builtin', 'singleLine', {
    helpText: 'LinkedIn username or full profile URL',
  });
  article.changeFieldControl('authorInstagram', 'builtin', 'singleLine', {
    helpText: 'Instagram handle (e.g. @username or username)',
  });
  article.changeFieldControl('authorTikTok', 'builtin', 'singleLine', {
    helpText: 'TikTok handle (e.g. @username or username)',
  });
  article.changeFieldControl('authorYouTube', 'builtin', 'singleLine', {
    helpText: 'YouTube handle or full channel URL',
  });
  article.changeFieldControl('authorFacebook', 'builtin', 'singleLine', {
    helpText: 'Facebook username or full profile/page URL',
  });
};
