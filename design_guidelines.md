# Design Guidelines: Imperfectos - Imperfectos que hacen match

## Design Approach

**Reference-Based Approach** drawing from dating app leaders (Tinder, Hinge, Bumble) but with deliberate subversion to emphasize authenticity over perfection. The design should feel honest, vulnerable, and refreshingly real—anti-Instagram aesthetic with functional clarity.

**Key Design Principle**: "Imperfectly Perfect" - embrace visual honesty while maintaining professional polish. The interface should feel approachable and human, not sterile or overly polished.

---

## Typography System

**Primary Font Family**: Inter or similar geometric sans-serif via Google Fonts CDN
- Display/Headlines: 600-700 weight, 2xl to 4xl sizes
- Body Text: 400 weight, base to lg sizes  
- Captions/Meta: 500 weight, sm to base sizes
- Defect Descriptions: 400 weight, base size (readable, comfortable)

**Secondary Font**: Optional monospace for authentic/raw elements (profile IDs, timestamps)

**Hierarchy**:
- Profile Names: text-2xl font-semibold
- Defect Headlines: text-lg font-medium
- Defect Descriptions: text-base leading-relaxed
- Match Percentage: text-3xl font-bold
- Button Text: text-sm font-medium uppercase tracking-wide

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16**
- Micro spacing: p-2, gap-2 (tight elements)
- Standard spacing: p-4, gap-4, m-4 (cards, buttons)
- Section spacing: py-8, py-12 (mobile/desktop)
- Large breaks: py-16, my-16 (major sections)

**Grid System**:
- Mobile: Single column, full-width cards
- Tablet: 2-column grid for browse view
- Desktop: 3-column masonry for discovery, single column for detailed profiles

**Container Strategy**:
- Full app wrapper: max-w-7xl mx-auto
- Profile cards: max-w-sm to max-w-md
- Defect text blocks: max-w-prose
- Chat interface: max-w-2xl

---

## Core Component Library

### 1. Navigation
**Top Navigation Bar**:
- Fixed position with slight transparency blur effect
- Height: h-16
- Logo/brand left, profile icon right
- Center: primary navigation (Descubrir, Matches, Mensajes, Perfil)
- Mobile: Bottom tab bar (h-20) with 4 icons

### 2. Profile Cards (Discovery View)
**Card Structure**:
- Rounded corners: rounded-2xl
- Shadow: shadow-lg
- Padding: p-0 (image edge-to-edge)
- Image aspect ratio: 3:4 portrait
- Overlay gradient on bottom third for text readability

**Card Content Layout**:
- Primary photo (full card background)
- Bottom overlay section (p-6):
  - Name, age (text-2xl font-semibold)
  - Match compatibility badge (pill shape, absolute top-right corner: rounded-full px-4 py-2)
  - Preview of top 3 defects (truncated with "...")
  - Subtle "Ver más" indicator

**Swipe Gestures**: 
- Drag transform with rotation (-15deg to 15deg)
- Action buttons below card: Pasar (X icon) / Interesar (Heart icon)
- Buttons: w-16 h-16 rounded-full, shadow-xl

### 3. Detailed Profile View
**Layout Structure**:
- Full-screen modal/page
- Sticky header with back button and action menu
- Photo gallery: horizontal scroll snap, aspect-[3/4], gap-2
- Photo indicator dots below gallery
- Validation badge visible: "Verificado por IA" with checkmark icon

**Defects Section**:
- Section title: "Mis Defectos Reales" (text-xl font-semibold, mb-6)
- Each defect as card: rounded-xl, border-2, p-6, mb-4
- Defect category badge (rounded-full, text-xs, mb-2)
- Defect description (leading-relaxed)
- Optional user notes in different treatment (italic, text-sm)

**Action Zone** (sticky bottom):
- Split buttons: "No es para mí" / "Me interesa"
- Full width on mobile, max-w-md centered on desktop
- Buttons: h-14, rounded-full, font-medium

### 4. Matching Algorithm Visualization
**Match Score Display**:
- Large circular progress indicator
- Percentage in center (text-4xl font-bold)
- Below: "Defectos en común" with count
- List of shared defects (max 5 visible)
- Each shared defect: flex items with icons, rounded-lg, p-3, gap-3

### 5. Photo Upload & AI Validation
**Upload Interface**:
- Dashed border dropzone: border-2 border-dashed, rounded-2xl, p-12
- Large upload icon (w-16 h-16)
- Instructions: "Sube fotos auténticas que muestren tu realidad"
- Maximum: 6 photos

**AI Validation Feedback**:
- Processing state: animated pulse, "Validando autenticidad..."
- Approved: checkmark badge, "Foto aprobada - muestra aspectos reales"
- Rejected: X icon, specific feedback "Esta foto parece muy editada. Prueba con algo más natural"
- Feedback cards: rounded-lg, border-l-4, p-4, mb-2

### 6. Matches Feed
**List View**:
- Each match: horizontal card, h-24, rounded-xl, mb-3
- Left: circular photo (w-20 h-20)
- Center: Name, top shared defect preview
- Right: match percentage badge + chevron
- Unread indicator: small dot on photo

### 7. Chat Interface
**Message Bubbles**:
- Sent: rounded-2xl rounded-br-sm, max-w-xs, p-4
- Received: rounded-2xl rounded-bl-sm, max-w-xs, p-4
- Timestamp: text-xs, mt-1
- Message input: fixed bottom, rounded-full, h-12, px-6

### 8. Onboarding Flow
**Steps**:
1. Welcome screen with value proposition
2. Photo upload (with validation explanation)
3. Defect selection/writing interface
4. Preview profile before publishing

**Defect Input Component**:
- Category selector: horizontal scroll chips (rounded-full, px-4, py-2)
- Textarea: min-h-32, rounded-xl, p-4, border-2
- Character count: text-sm (minimum encouraged: 100 chars)
- "Añadir otro defecto" button: border-2 border-dashed, rounded-xl, h-12

### 9. Settings & Preferences
**Toggle Controls**: 
- Modern switch design, h-6
- Label left, control right
- Section groups with dividers

### 10. Empty States
- Illustration or icon (w-32 h-32, mx-auto)
- Heading (text-xl font-semibold, mt-6)
- Description (text-base, mt-2, max-w-sm)
- CTA button (mt-8)

---

## Images Strategy

**Required Images**:
1. **Onboarding Hero**: Illustration showing diverse, real people in candid moments (not posed perfection). Should feel warm and inclusive.

2. **Profile Photos**: User-uploaded, AI-validated photos. Display at 3:4 aspect ratio, optimized for portrait orientation.

3. **Empty State Illustrations**: Custom or library illustrations for:
   - No matches yet
   - No messages
   - Upload your first photo

4. **Achievement Badges**: Small SVG icons for milestones (first match, complete profile, etc.)

**Image Treatment**:
- Never apply heavy filters
- Maintain authentic feel with minimal processing
- Use subtle border-radius (rounded-xl to rounded-2xl)
- Lazy loading for performance

---

## Interaction Patterns

**Micro-interactions** (minimal, purposeful):
- Card swipe physics: smooth spring animation
- Button press: scale-95 on active
- Photo gallery: momentum scrolling with snap points
- Match celebration: confetti animation (library-based, one-time)
- Typing indicators: animated dots

**Transitions**:
- Modal/page slides: slide-up on mobile, fade on desktop
- Navigation: crossfade between sections
- Duration: 200-300ms (snappy, not sluggish)

---

## Accessibility

- Touch targets: minimum 44px (h-11, w-11)
- Focus states: ring-2 ring-offset-2 on all interactive elements
- Semantic HTML: proper heading hierarchy, ARIA labels
- Form inputs: associated labels, error states with icons and text
- High contrast ratios maintained throughout
- Keyboard navigation fully supported

---

## Responsive Behavior

**Mobile-First Breakpoints**:
- sm: 640px (large phones)
- md: 768px (tablets)
- lg: 1024px (desktop)

**Key Adaptations**:
- Bottom navigation on mobile, top navigation on desktop
- Single column cards on mobile, multi-column grid on desktop
- Full-screen modals on mobile, centered overlays on desktop
- Stack action buttons vertically on small screens

---

This design creates an honest, approachable dating experience that celebrates authenticity while maintaining professional quality and excellent usability.