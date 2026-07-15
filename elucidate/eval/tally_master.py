#!/usr/bin/env python3
"""Regenerate the unified 8-model matrix from the raw results files in this directory.

Every cell = solved (surfaced_constraint AND correct_recommendation) out of an identical
denominator per column: family/10, famous/8, iso/10, mint/2, total/30. Naive solve prompt,
2 trials per problem per arm, everywhere.
"""
import json, os
H = os.path.dirname(os.path.abspath(__file__))

SETS = {
    'family': ['car-wash','charger','couch','plant','mail-neighbor'],
    'famous': ['aiw-sibling-count','dead-cat-box','unit-mismatch-weight','river-trivial-crossing'],
    'iso':    ['dayshift-self-count','burned-bulb-switch','meter-vs-yard','freight-elevator','flat-tire-ride'],
    'mint':   ['mint-match-frame'],
}
ALL = [p for ids in SETS.values() for p in ids]

def claude_records(*sources):
    """sources: (filename, allowed_problem_ids) pairs — restrict each file to the sets it
    contributes so overlapping runs never double-count a cell."""
    recs = []
    for f, allowed in sources:
        d = json.load(open(os.path.join(H, f)))
        for r in d['records']:
            if r['problemId'] in allowed and r['distillMode'] in ('none','B'):
                recs.append({'problem': r['problemId'],
                             'arm': 'bare' if r['distillMode']=='none' else 'distill',
                             'solved': bool(r['surfaced_constraint'] and r['correct_recommendation'])})
    return recs

def run7_records(f):
    d = json.load(open(os.path.join(H, f)))
    return [{'problem': r['problem'], 'arm': r['arm'], 'solved': bool(r.get('solved'))}
            for r in d['records'] if r['problem'] in ALL]

def run7_split(f):
    d = json.load(open(os.path.join(H, f)))
    out = {}
    for r in d['records']:
        m = r['model'].split('/')[-1]
        if r['problem'] in ALL:
            out.setdefault(m, []).append({'problem': r['problem'], 'arm': r['arm'],
                                          'solved': bool(r.get('solved'))})
    return out

FAM, FAMOUS, ISO, MINT = SETS['family'], SETS['famous'], SETS['iso'], SETS['mint']
MODELS = {
    'claude haiku 4.5':  claude_records(('results-run6d-haiku-family.json', FAM),
                                        ('results-run6a-haiku.json', FAMOUS + ISO),
                                        ('results-run4.json', MINT)),
    'claude sonnet 4.6': claude_records(('results-run6e-sonnet-family.json', FAM),
                                        ('results-run6b-sonnet.json', FAMOUS + ISO),
                                        ('results-run8-sonnet-mint.json', MINT)),
    'claude opus':       claude_records(('results-run6c-opus.json', FAM + ['flat-tire-ride']),
                                        ('results-run6f-opus-patterns.json', FAMOUS + MINT +
                                         ['dayshift-self-count','burned-bulb-switch','meter-vs-yard','freight-elevator'])),
    'deepseek-v4-pro':   run7_records('results-run7-deepseek.json'),
}
MODELS.update(run7_split('results-run7-bailian.json'))

def cell(recs, ids, arm):
    hits = [r for r in recs if r['problem'] in ids and r['arm'] == arm]
    n = sum(1 for r in hits if r['solved'])
    return n, len(hits)

print('| Model | family /10 | famous /8 | isomorphs /10 | mint-match /2 | total /30 |')
print('|---|---|---|---|---|---|')
for m, recs in MODELS.items():
    row, tb, td = [], 0, 0
    ok = True
    for s, ids in SETS.items():
        b, nb = cell(recs, ids, 'bare'); d_, nd = cell(recs, ids, 'distill')
        want = len(ids)*2
        if nb != want or nd != want:
            ok = False
        tb += b; td += d_
        row.append(f'{b}→{d_}')
    flag = '' if ok else ' ⚠ incomplete'
    print(f'| {m} | ' + ' | '.join(row) + f' | **{tb}→{td}**{flag} |')
