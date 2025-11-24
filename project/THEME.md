# 🌓 Mode Dark/Light - Documentation

## ✨ Fonctionnalités ajoutées

### Toggle dans le header
- Un bouton de bascule élégant avec animation
- Icône Soleil ☀️ en mode clair
- Icône Lune 🌙 en mode sombre
- Accessible depuis toutes les pages

### Variables CSS adaptatives
Toutes les couleurs utilisent maintenant des variables CSS qui changent automatiquement :

#### Mode clair (par défaut)
```css
--color-primary: #6161ff
--color-bg-start: #f6f5fb
--color-bg-end: #e9e6f7
--color-card: #ffffff
--color-text: #323338
```

#### Mode sombre
```css
--color-primary: #7c7cff
--color-bg-start: #0f0f1a
--color-bg-end: #1a1a2e
--color-card: #1f1f2e
--color-text: #e4e4e7
```

### Persistence
Le thème choisi est **automatiquement sauvegardé** dans localStorage et restauré au rechargement de l'application.

## 🎨 Design

### Couleurs
- **Background** : Dégradé sombre élégant (#0f0f1a → #1a1a2e)
- **Cartes** : #1f1f2e (gris-bleu foncé)
- **Texte** : #e4e4e7 (gris clair)
- **Primary** : #7c7cff (violet plus lumineux)

### Transitions
- Transitions douces de 0.3s sur le body
- Ombres adaptées au mode sombre
- Scrollbar qui s'adapte automatiquement

## 🔧 Architecture technique

### Fichiers modifiés

1. **`/src/types.ts`**
   - Ajout de `theme: 'light' | 'dark'` dans `Settings`

2. **`/src/components/layout/ThemeToggle.tsx`** (nouveau)
   - Composant toggle réutilisable
   - Animation du slider
   - Accessibilité (aria-label)

3. **`/src/components/layout/PageHeader.tsx`**
   - Intégration du ThemeToggle
   - Props `theme` et `onThemeToggle`

4. **`/src/styles/globals.css`**
   - Variables CSS pour le mode clair
   - Classe `.dark` avec variables pour le mode sombre
   - Transitions sur le body

5. **`/src/App.tsx`**
   - useEffect pour appliquer la classe `dark` sur `<html>`
   - Handler `handleThemeToggle`
   - Passage des props aux pages

6. **`/src/hooks/useSettings.ts`**
   - Ajout de `theme: 'light'` dans DEFAULT_SETTINGS

7. **Composants mis à jour**
   - Tous les composants utilisent maintenant `var(--color-card)` au lieu de `bg-white`
   - Les variables CSS garantissent l'adaptation automatique

## 📱 Utilisation

### Pour l'utilisateur
1. Cliquer sur le toggle en haut à droite (toutes les pages)
2. Le thème change instantanément
3. Le choix est sauvegardé

### Pour le développeur
```tsx
// Le thème est géré automatiquement via les variables CSS
<div className="bg-[var(--color-card)]">
  <h1 className="text-[var(--color-text)]">Titre</h1>
  <p className="text-[var(--color-text-light)]">Texte</p>
</div>
```

## 🎯 Avantages

✅ **Simple** : Un seul clic pour changer de thème  
✅ **Persistent** : Le choix est sauvegardé  
✅ **Fluide** : Transitions douces  
✅ **Complet** : Toute l'app s'adapte  
✅ **Accessible** : Labels ARIA et contrastes respectés  
✅ **Performant** : Variables CSS natives  

## 🚀 Déploiement

Le mode dark/light est déjà inclus dans le build. Aucune configuration supplémentaire nécessaire !

```bash
npm run build
```

Le thème sera automatiquement fonctionnel en production.
