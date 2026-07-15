#!/usr/bin/env python3
"""Strict-YAML check for every SKILL.md frontmatter. Run before pushing.

Claude Code's loader is lenient, but strict parsers (fleet lint, other skill loaders)
reject plain-scalar descriptions containing ": " — always use a `>-` block scalar.
Regression history: caught in the wild 2026-07-16 (openclaw-fleet #575).
"""
import sys, glob, yaml

fail = 0
for p in sorted(glob.glob('*/SKILL.md')):
    fm = open(p).read().split('---')[1]
    try:
        d = yaml.safe_load(fm)
        assert d.get('name') and d.get('description'), f'{p}: missing name/description'
        print(f'ok    {p}')
    except Exception as e:
        print(f'FAIL  {p}: {str(e).splitlines()[0]}')
        fail = 1
sys.exit(fail)
