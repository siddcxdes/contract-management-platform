# contract management platform

a simple yet powerful frontend application for managing contract blueprints and their lifecycle.

## features

### 1. blueprint creation
- create reusable contract templates with custom fields
- supported field types: text, date, signature, checkbox
- position fields with x,y coordinates
- view all created blueprints

### 2. contract creation
- generate contracts from existing blueprints
- inherit all fields from the selected blueprint
- fill in values for each field
- edit contracts (unless locked or revoked)

### 3. contract lifecycle management
the application enforces a strict state machine for contract progression:

```
created → approved → sent → signed → locked
    ↓         ↓        ↓
         revoked
```

**rules:**
- contracts can only transition to allowed next states
- locked contracts cannot be edited
- revoked contracts cannot proceed further
- state transitions are validated before execution

### 4. contract dashboard
- view all contracts in a table format
- filter by status: all, active, pending, signed
- see contract details including name, blueprint, status, and creation date
- visual lifecycle timeline showing current state
- change contract status with validation

## tech stack

- **react** - component-based ui library
- **vite** - fast build tool and dev server
- **context api** - state management
- **local storage** - data persistence
- **vanilla css** - styling with custom design system

## architecture decisions

### state management
used react context api for global state management because:
- simple and built into react
- no external dependencies needed
- sufficient for this application's complexity
- easy to understand and maintain

### data persistence
implemented local storage for data persistence:
- no backend required
- data persists across browser sessions
- simple to implement and test
- suitable for frontend-only application

### component structure
organized components by functionality:
- **context/** - global state management
- **components/** - reusable ui components
- **utils/** - helper functions and constants

### lifecycle state machine
implemented strict state transitions using a state machine pattern:
- prevents invalid state changes
- ensures data integrity
- makes contract flow predictable
- easy to extend with new states

### code organization
kept code simple and readable:
- small, focused functions
- clear variable names
- comments explaining the "why"
- consistent naming conventions

## folder structure

```
src/
├── components/
│   ├── BlueprintCreator.jsx    # create new blueprints
│   ├── BlueprintList.jsx       # display all blueprints
│   ├── ContractCreator.jsx     # create contracts from blueprints
│   ├── ContractDashboard.jsx   # main dashboard with filtering
│   ├── ContractEditor.jsx      # edit contract field values
│   └── LifecycleTimeline.jsx   # visual state progression
├── context/
│   └── AppContext.jsx          # global state management
├── utils/
│   ├── constants.js            # state machine and field types
│   └── storage.js              # local storage helpers
├── App.jsx                     # main app component
├── main.jsx                    # entry point
└── index.css                   # global styles
```

## setup instructions

### prerequisites
- node.js (version 14 or higher)
- npm or yarn

### installation

1. clone the repository:
```bash
git clone <repository-url>
cd eurusys
```

2. install dependencies:
```bash
npm install
```

3. start the development server:
```bash
npm run dev
```

4. open your browser and navigate to:
```
http://localhost:5173
```

### build for production

```bash
npm run build
```

the production files will be in the `dist/` folder.

## usage guide

### creating a blueprint

1. click "create blueprint" button
2. enter blueprint name
3. add fields by:
   - entering field label
   - selecting field type
   - setting position (x, y coordinates)
   - clicking "add field"
4. repeat for all fields
5. click "save blueprint"

### creating a contract

1. click "create contract" button
2. enter contract name
3. select a blueprint from dropdown
4. preview blueprint fields
5. click "create contract"

### editing a contract

1. go to dashboard
2. click "edit" on any contract
3. fill in field values
4. click "save changes"

note: locked and revoked contracts cannot be edited.

### managing contract lifecycle

1. click "view" on any contract
2. see current state in timeline
3. use action buttons to transition to next valid state
4. states automatically validate before transition

### filtering contracts

use filter buttons to view:
- **all contracts** - every contract
- **active** - created and approved contracts
- **pending** - sent contracts awaiting signature
- **signed** - signed and locked contracts

## assumptions and limitations

### assumptions
- single user application (no authentication)
- data stored locally in browser
- contracts follow linear progression (except revoked)
- field positioning uses simple x,y coordinates

### limitations
- no drag-and-drop field placement
- no backend api integration
- data not synced across devices
- no user authentication or authorization
- no contract templates export/import
- limited field validation
- no file attachments
- no email notifications
- basic positioning system (not wysiwyg)

### future enhancements
- drag-and-drop field builder
- backend integration with api
- user authentication
- contract templates library
- advanced field validation
- file upload support
- email notifications for state changes
- pdf export functionality
- collaborative editing
- audit trail for changes

## design decisions

### ui/ux
- clean, minimal interface
- purple gradient theme for modern look
- josefin sans font for readability
- card-based layout for organization
- color-coded status badges
- visual timeline for lifecycle
- responsive design principles

### code style
- lowercase text throughout
- simple english in comments
- no complex jargon
- student-friendly code structure
- clear function names
- modular components

### validation
- client-side validation for forms
- state machine for lifecycle transitions
- readonly mode for locked/revoked contracts
- user-friendly error messages

## testing

### manual testing checklist

- [ ] create a blueprint with multiple field types
- [ ] create a contract from blueprint
- [ ] edit contract and save changes
- [ ] transition contract through all states
- [ ] try invalid state transitions
- [ ] filter contracts by status
- [ ] verify locked contracts cannot be edited
- [ ] verify revoked contracts cannot progress
- [ ] test with empty data
- [ ] test browser refresh (data persistence)

## browser compatibility

tested on:
- chrome (latest)
- firefox (latest)
- safari (latest)
- edge (latest)

## license

this project is created for educational purposes.

## contact

for questions or feedback, please open an issue on github.
