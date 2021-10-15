const Xs = Object(u.observer)((e) => {
  const {
    store: t,
    rootName: n,
    getRefLabel: r,
    shouldRenderGoToRef: i,
    whitelistTypes: o,
    maxRows: a,
    className: s,
    innerClassName: u,
    customRowActionRenderer: l,
    refSelector: d,
  } = e;

  const h = t.transformed;
  const f = t.updateTransformed;
  const p = t.treeStore;

  const g = c.useCallback(
    (e, t) => {
      f('set', e, t);
    },
    [f],
  );

  const m = c.useCallback(
    (e, t) => {
      let n = e.length ? Object(S.get)(h, e) : h;
      n = Object(S.cloneDeep)(Object(S.pick)(n, ls));
      Object(S.merge)(n, t);
      f('set', e, n);
    },
    [h, f],
  );

  const v = c.useCallback(
    (e) => {
      const t = Object(S.cloneDeep)(h);
      const n = Object(S.clone)(e);
      const r = n.pop();
      Object(S.pullAt)(Object(S.get)(t, n), Number(r));
      f('set', [], t);
    },
    [h, f],
  );

  const y = c.useCallback(
    (e, t, n, r) => {
      let i;
      let o = n;

      if (r) {
        o = o.concat(r);
      }

      if (t) {
        o = o.concat('0');
      }

      i = fs(is, e)
        ? {
            type: 'object',
            properties: {},
          }
        : {
            type: 'string',
          };

      o = fs(is, t)
        ? o.concat(t)
        : fs(is, e)
        ? o.concat(e)
        : o.concat('children');
      const a = Object(S.cloneDeep)(Object(S.get)(h, o)) || [];
      a.push(i);
      f('set', o, a);
    },
    [f, h],
  );

  const b = c.useCallback(
    (e, t, n) => {
      const r = e.slice(0, e.length - 1);
      const i = Object(S.get)(h, r).slice();
      i[n] = i.splice(t, 1, i[n])[0];
      f('set', r, i);
    },
    [f, h],
  );

  const _ = c.useCallback(
    (e) => {
      const t = e.slice(0, e.length - 1);
      const n = Object(S.get)(h, t).slice();
      const r = n[e[e.length - 1]];
      const i = Object(S.cloneDeep)(r);
      n.splice(n.indexOf(r), 0, i);

      if ('name' in r) {
        r.name = Ai(Object(S.map)(n, 'name'), r.name);
      }

      f('set', t, n);
    },
    [f, h],
  );

  const w = c.useCallback(
    (e, t, n, r, i, o, a) => {
      Ja(
        {
          schema: h,
          onChange: f,
        },
        e,
        t,
        n,
        r,
        i,
        o,
        a,
      );
    },
    [h, f],
  );

  const M = c.useCallback(
    (e, a) =>
      c.createElement(
        Ks,
        Object.assign(
          {
            node: e,
          },
          e.metadata,
          e.metadata !== undefined &&
            e.metadata.refPath !== null && {
              refPath: String(e.metadata.refPath),
            },
          {
            rowOptions: a,
            store: t,
            customRowActionRenderer: l,
            refSelector: d,
            rootName: n,
            whitelistTypes: o,
            getRefLabel: r,
            shouldRenderGoToRef: i,
            addHandler: y,
            removeHandler: v,
            changeHandler: g,
            typeChangeHandler: w,
            propsChangeHandler: m,
            isAutoFocusBlocked: t.isAutoFocusBlocked,
            setAutoFocusBlocked: (e) => (t.isAutoFocusBlocked = e),
            swapHandler: b,
            cloneHandler: _,
          },
        ),
      ),
    [t, l, d, n, o, r, i, y, v, g, w, m, b, _],
  );

  return c.createElement(
    Ls.Provider,
    {
      value: t,
    },
    c.createElement(Ka.TreeList, {
      striped: true,
      className: R('JsonSchemaEditor', s),
      innerClassName: u,
      interactive: false,
      store: p,
      rowRenderer: M,
      maxRows: a !== undefined ? a + 0.5 : a,
    }),
  );
});
