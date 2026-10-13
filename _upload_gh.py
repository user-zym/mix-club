# -*- coding: utf-8 -*-
"""通过 GitHub API 将竞赛目录文件上传到 user-zym/mix-club 仓库（绕过被断的 git 直连）"""
import base64, io, json, os, subprocess, sys, tempfile, time, urllib.parse

ROOT = r'C:\Users\User\Desktop\竞赛'
REPO = 'user-zym/mix-club'
SKIP_DIRS = {'.git'}
SKIP_FILES = {'座位图预览.png'}

def run(cmd, timeout=60):
    p = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
    return p

def upload(path, rel):
    with open(path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode('ascii')
    quoted = urllib.parse.quote(rel, safe='/')
    payload = json.dumps({'message': 'init', 'content': b64})
    with tempfile.NamedTemporaryFile('w', encoding='utf-8', suffix='.json', delete=False) as tf:
        tf.write(payload)
        payload_path = tf.name
    try:
        cmd = ['gh', 'api', '--method', 'PUT',
               'repos/%s/contents/%s' % (REPO, quoted),
               '--input', payload_path]
        p = run(cmd)
        if p.returncode != 0:
            raise RuntimeError(p.stderr.strip()[:300])
    finally:
        try: os.unlink(payload_path)
        except OSError: pass

files = []
for dirpath, dirnames, filenames in os.walk(ROOT):
    dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
    for fn in filenames:
        full = os.path.join(dirpath, fn)
        rel = os.path.relpath(full, ROOT).replace('\\', '/')
        if rel in SKIP_FILES:
            continue
        files.append((full, rel))

files.sort(key=lambda x: x[1])
print('TOTAL_FILES:', len(files))
ok = 0
for i, (full, rel) in enumerate(files, 1):
    for attempt in range(3):
        try:
            upload(full, rel)
            ok += 1
            print('[%d/%d] OK %s' % (i, len(files), rel))
            break
        except Exception as e:
            if attempt == 2:
                print('[%d/%d] FAIL %s :: %s' % (i, len(files), rel, e))
            else:
                time.sleep(2)
    if ok % 15 == 0:
        time.sleep(1)
print('DONE ok=%d/%d' % (ok, len(files)))
sys.exit(0 if ok == len(files) else 1)
