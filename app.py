from flask import Flask, render_template, request, jsonify
import numpy as np

app = Flask(__name__)

ROWS = 5
COLS = 5
GAMMA = 0.9
THRESHOLD = 1e-4

def get_possible_actions(state, blocks):
    r, c = state
    actions = []
    if r > 0 and (r - 1, c) not in blocks: actions.append((0, "Up", (r-1, c)))
    if r < ROWS - 1 and (r + 1, c) not in blocks: actions.append((1, "Down", (r+1, c)))
    if c > 0 and (r, c - 1) not in blocks: actions.append((2, "Left", (r, c-1)))
    if c < COLS - 1 and (r, c + 1) not in blocks: actions.append((3, "Right", (r, c+1)))
    return actions

def get_possible_actions_boundary(state, blocks):
    # To conform strictly to Value Iteration on a grid:
    # Attempting to move into a wall or block simply results in staying in the same state.
    r, c = state
    actions = {
        "Up": (r-1, c) if (r > 0 and (r-1, c) not in blocks) else (r, c),
        "Down": (r+1, c) if (r < ROWS - 1 and (r+1, c) not in blocks) else (r, c),
        "Left": (r, c-1) if (c > 0 and (r, c-1) not in blocks) else (r, c),
        "Right": (r, c+1) if (c < COLS - 1 and (r, c+1) not in blocks) else (r, c)
    }
    return actions

def run_value_iteration(start, end, blocks):
    V = np.zeros((ROWS, COLS))
    policy = [[None for _ in range(COLS)] for _ in range(ROWS)]
    
    # Value iteration
    while True:
        delta = 0
        new_V = np.copy(V)
        for r in range(ROWS):
            for c in range(COLS):
                if (r, c) == end or (r, c) in blocks:
                    continue
                
                actions = get_possible_actions_boundary((r, c), blocks)
                max_val = float('-inf')
                for act_name, next_state in actions.items():
                    r_next, c_next = next_state
                    reward = 10 if next_state == end else -1 
                    val = reward + GAMMA * V[r_next, c_next]
                    if val > max_val:
                        max_val = val
                
                new_V[r, c] = max_val
                delta = max(delta, abs(new_V[r, c] - V[r, c]))
                
        V = new_V
        if delta < THRESHOLD:
            break
            
    # Calculate optimal policy
    for r in range(ROWS):
        for c in range(COLS):
            if (r, c) == end or (r, c) in blocks:
                # None policy for block and end
                continue
                
            actions = get_possible_actions_boundary((r, c), blocks)
            best_act = None
            max_val = float('-inf')
            # Handle ties by consistent order or select the best
            for act_name, next_state in actions.items():
                r_next, c_next = next_state
                reward = 10 if next_state == end else -1
                val = reward + GAMMA * V[r_next, c_next]
                if val > max_val:
                    max_val = val
                    best_act = act_name
                    
            policy[r][c] = best_act
            
    return V.tolist(), policy

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    start = tuple(data.get('start', [0, 0]))
    end = tuple(data.get('end', [4, 4]))
    blocks = [tuple(p) for p in data.get('blocks', [[1,1], [2,2], [3,3]])]
    
    v, policy = run_value_iteration(start, end, blocks)
    
    return jsonify({
        'values': v,
        'policy': policy
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
