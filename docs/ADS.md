# Banner ads

Two ad slots are in place in low-intrusion spots:

1. **Footer banner** – Full-width strip above the footer text (home and main content). Good for horizontal display ads.
2. **Sidebar** – Rectangle at the bottom of the sidebar (300×250 style). Visible when the sidebar is open; on desktop it sits below settings/leaderboard.

Both use the `AdSlot` component. Right now they show a placeholder; replace that with your ad network code.

---

## Google AdSense

1. **Add the script once**  
   In `index.html` (before `</head>` or before `</body>`), add:

   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXX" crossorigin="anonymous"></script>
   ```
   Replace `ca-pub-XXXXXX` with your AdSense client ID.

2. **Create ad units** in AdSense (e.g. one “Display” for footer, one “Medium rectangle” for sidebar) and note each **data-ad-slot** ID.

3. **Use the slots in the app**  
   You can either:

   - **Option A – Pass ad markup as children**  
     In `Home.tsx`, replace `<AdSlot id="ad-footer" placement="footer" />` with something like:

     ```tsx
     <AdSlot id="ad-footer" placement="footer">
       <ins
         className="adsbygoogle"
         style={{ display: "block" }}
         data-ad-client="ca-pub-XXXXXX"
         data-ad-slot="YYYYYY"
         data-ad-format="auto"
         data-full-width-responsive="true"
       />
     </AdSlot>
     ```
     Then run `(window as any).adsbygoogle = (window as any).adsbygoogle || []; (window as any).adsbygoogle.push({});` once after the component mounts (e.g. in a `useEffect` that runs once, or in the AdSense docs’ recommended way).

   - **Option B – Inject via `index.html`**  
     Keep the placeholder and add your ad units in `index.html` in the right order, or use AdSense’s auto ads and let Google place them (you can still keep these slots for manual units).

4. **Policy**  
   Follow [AdSense program policies](https://support.google.com/adsense/answer/48182). Avoid too many ads or intrusive placement; the current slots are chosen to stay non-annoying.

---

## Other networks (Carbon, Media.net, etc.)

Use the same slots: render your network’s tag inside `<AdSlot>` as `children`, or inject it into the slot `id` (e.g. `ad-footer`, `ad-sidebar`) from your script. The container keeps layout stable (min-height, border) so the page doesn’t jump when the ad loads.
