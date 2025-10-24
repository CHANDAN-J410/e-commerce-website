// Debug blocker: detect full-viewport elements that accept pointer events and temporarily disable them
(function(){
  function isCoveringViewport(el){
    try{
      const r = el.getBoundingClientRect();
      const vw = window.innerWidth || document.documentElement.clientWidth;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const coversW = r.width >= vw * 0.9 && r.left <= vw * 0.05;
      const coversH = r.height >= vh * 0.9 && r.top <= vh * 0.05;
      return coversW && coversH;
    }catch(e){return false}
  }

  function findBlockers(){
    const all = Array.from(document.body.querySelectorAll('*'));
    return all.filter(el => {
      const style = window.getComputedStyle(el);
      if (style.pointerEvents === 'none') return false;
      const pos = style.position;
      if (pos !== 'fixed' && pos !== 'absolute' && pos !== 'sticky') return false;
      const z = parseInt(style.zIndex,10) || 0;
      if (z <= 0) return false;
      return isCoveringViewport(el);
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    console.group('[debug-blocker] scanning for full-viewport blocking elements');
    const blockers = findBlockers();
    if (!blockers.length) {
      console.log('[debug-blocker] none found');
    } else {
      blockers.forEach((b,i)=>{
        console.log('[debug-blocker] blocker', i, b.tagName, b.className, b, 'computed styles', window.getComputedStyle(b));
        // temporarily disable pointer events so you can interact
        b.style.pointerEvents = 'none';
        b.setAttribute('data-debug-blocker', 'true');
      });
      console.warn('[debug-blocker] pointer-events disabled on blocking elements (data-debug-blocker=true)');
    }
    console.groupEnd();

    document.addEventListener('pointerdown', function(e){
      console.debug('[debug-blocker] pointerdown target:', e.target, 'closest clickable?', e.target.closest && e.target.closest('button, a, [role="button"], input') );
    }, {capture:true});
  });
})();
