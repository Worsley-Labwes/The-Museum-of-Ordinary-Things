import { useEffect, useState } from "react";

const starterExhibits = [
    {
        id: "first-rain",
        title: "The first rain after summer",
        category: "Moments",
        date: "2026-09-18",
        place: "On the walk home",
        story: "The pavement went dark in seconds. Everyone on the street looked up at the same time.",
        image: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1200&q=85",
        favorite: true,
    },
    {
        id: "blue-mug",
        title: "The blue mug",
        category: "Objects",
        date: "2026-08-03",
        place: "Kitchen windowsill",
        story: "Chipped on the handle, somehow always the one I reach for. It makes ordinary tea feel like a small ritual.",
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85",
        favorite: false,
    },
    {
        id: "long-way",
        title: "Taking the long way",
        category: "Places",
        date: "2026-07-21",
        place: "The path by the water",
        story: "No destination, no headphones. Just the sound of the water and an extra twenty minutes to myself.",
        image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=85",
        favorite: false,
    },
    {
        id: "recipe-card",
        title: "A recipe in her handwriting",
        category: "Notes",
        date: "2026-06-12",
        place: "Inside the old cookbook",
        story: "There are no measurements, just 'until it looks right.' Somehow, it always does.",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=85",
        favorite: true,
    },
    {
        id: "window-light",
        title: "Light at 4:17 pm",
        category: "Moments",
        date: "2026-05-28",
        place: "The living room",
        story: "For a few minutes the whole room turned gold. Nobody said anything. We just stayed there.",
        image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=900&q=85",
        favorite: false,
    },
    {
        id: "ticket-stub",
        title: "One more song",
        category: "Objects",
        date: "2026-04-09",
        place: "A ticket in my coat pocket",
        story: "We missed the last train and walked home singing the chorus we both knew by heart.",
        image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=85",
        favorite: false,
    },
];

const categories = ["Everything", "Objects", "Moments", "Places", "Notes"];
const currentDate = new Date();
const today = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

function readExhibits() {
    try {
        const saved = localStorage.getItem("ordinary-things-exhibits");
        return saved ? JSON.parse(saved) : starterExhibits;
    } catch {
        return starterExhibits;
    }
}

function readConnections() {
    try {
        return JSON.parse(localStorage.getItem("ordinary-things-connections") || "[]");
    } catch {
        return [];
    }
}

function formatDate(date) {
    return new Date(`${date}T12:00:00`).toLocaleDateString("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function App() {
    const [exhibits, setExhibits] = useState(readExhibits);
    const [connections, setConnections] = useState(readConnections);
    const [activeCategory, setActiveCategory] = useState("Everything");
    const [search, setSearch] = useState("");
    const [activeView, setActiveView] = useState("collection");
    const [isAdding, setIsAdding] = useState(false);
    const [selectedExhibit, setSelectedExhibit] = useState(null);
    const [connectionPair, setConnectionPair] = useState(null);

    useEffect(() => {
        localStorage.setItem("ordinary-things-exhibits", JSON.stringify(exhibits));
    }, [exhibits]);

    useEffect(() => {
        localStorage.setItem("ordinary-things-connections", JSON.stringify(connections));
    }, [connections]);

    const visibleExhibits = exhibits.filter((exhibit) => {
        const matchesCategory = activeCategory === "Everything" || exhibit.category === activeCategory;
        const matchesSaved = activeView !== "favorites" || exhibit.favorite;
        const query = search.trim().toLowerCase();
        const matchesSearch = !query || [exhibit.title, exhibit.story, exhibit.place, exhibit.category]
            .some((value) => value.toLowerCase().includes(query));
        return matchesCategory && matchesSaved && matchesSearch;
    });

    function toggleFavorite(id) {
        setExhibits((current) => current.map((exhibit) => (
            exhibit.id === id ? { ...exhibit, favorite: !exhibit.favorite } : exhibit
        )));
        setSelectedExhibit((current) => current?.id === id ? { ...current, favorite: !current.favorite } : current);
    }

    function addExhibit(event) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const exhibit = {
            id: crypto.randomUUID(),
            title: form.get("title").trim(),
            category: form.get("category"),
            date: form.get("date"),
            place: form.get("place").trim() || "Somewhere worth remembering",
            story: form.get("story").trim(),
            image: form.get("image").trim(),
            favorite: false,
        };
        setExhibits((current) => [exhibit, ...current]);
        setActiveCategory("Everything");
        setActiveView("collection");
        setSearch("");
        setIsAdding(false);
    }

    function openSurprise() {
        if (visibleExhibits.length) {
            setSelectedExhibit(visibleExhibits[Math.floor(Math.random() * visibleExhibits.length)]);
        }
    }

    function drawConnectionPair() {
        if (exhibits.length < 2) return;

        const existingPairs = new Set(connections.map((connection) => [...connection.exhibitIds].sort().join(":")));
        const unusedPairs = [];
        for (let first = 0; first < exhibits.length; first += 1) {
            for (let second = first + 1; second < exhibits.length; second += 1) {
                const pair = [exhibits[first], exhibits[second]];
                if (!existingPairs.has(pair.map((exhibit) => exhibit.id).sort().join(":"))) {
                    unusedPairs.push(pair);
                }
            }
        }

        const availablePairs = unusedPairs.length ? unusedPairs : exhibits.flatMap((first, index) =>
            exhibits.slice(index + 1).map((second) => [first, second])
        );
        const pair = availablePairs[Math.floor(Math.random() * availablePairs.length)];
        setConnectionPair(pair.map((exhibit) => exhibit.id));
    }

    function saveConnection(event) {
        event.preventDefault();
        const reflection = new FormData(event.currentTarget).get("reflection").trim();
        if (!connectionPair || !reflection) return;

        setConnections((current) => [{
            id: crypto.randomUUID(),
            exhibitIds: connectionPair,
            reflection,
            createdAt: today,
        }, ...current]);
        setConnectionPair(null);
    }

    function openView(view) {
        setActiveView(view);
        if (view === "connections" && exhibits.length > 1 && !connectionPair) {
            drawConnectionPair();
        }
    }

    const drawnExhibits = connectionPair?.map((id) => exhibits.find((exhibit) => exhibit.id === id)).filter(Boolean) || [];
    const savedConnections = connections.filter((connection) => connection.exhibitIds.every((id) => exhibits.some((exhibit) => exhibit.id === id)));

    return (
        <div className="museum-shell">
            <aside className="sidebar">
                <a className="brand" href="#collection" aria-label="Museum of Ordinary Things home">
                    <span className="brand-mark" aria-hidden="true"><span /></span>
                    <span className="brand-name">ordinary<br />things<span className="brand-period">.</span></span>
                </a>

                <div className="sidebar-section-label">YOUR MUSEUM</div>
                <nav className="side-nav" aria-label="Museum views">
                    <button className={activeView === "collection" ? "side-link active" : "side-link"} onClick={() => openView("collection")}>
                        <span className="side-icon collection-icon" aria-hidden="true">▦</span>
                        <span>Collection</span>
                        <span className="side-count">{exhibits.length}</span>
                    </button>
                    <button className={activeView === "favorites" ? "side-link active" : "side-link"} onClick={() => openView("favorites")}>
                        <span className="side-icon" aria-hidden="true">♡</span>
                        <span>Favorites</span>
                        <span className="side-count">{exhibits.filter((exhibit) => exhibit.favorite).length}</span>
                    </button>
                    <button className={activeView === "connections" ? "side-link active" : "side-link"} onClick={() => openView("connections")}>
                        <span className="side-icon" aria-hidden="true">⌁</span>
                        <span>Connections</span>
                        <span className="side-count">{connections.length}</span>
                    </button>
                </nav>

                <div className="sidebar-note">
                    <span className="note-spark" aria-hidden="true">✳</span>
                    <p>A place for the little things that turn out to be the big things.</p>
                </div>

                <div className="sidebar-bottom">
                    <span className="online-dot" /> A museum of one, and growing
                </div>
            </aside>

            <main className="main-content" id="collection">
                <header className="topbar">
                    <div className="breadcrumb"><span>YOUR MUSEUM</span><span className="breadcrumb-slash">/</span><strong>{activeView === "favorites" ? "FAVORITES" : activeView === "connections" ? "THE CONNECTION ROOM" : "THE COLLECTION"}</strong></div>
                    <button className="add-button" onClick={() => setIsAdding(true)}><span aria-hidden="true">+</span> Add an exhibit</button>
                </header>

                <section className="intro">
                    <div className="intro-copy">
                        <p className="eyebrow"><span className="eyebrow-line" /> A CABINET OF CURIOSITIES, PERSONAL EDITION</p>
                        <h1>The Museum of<br /><em>Ordinary</em> Things<span className="title-period">.</span></h1>
                        <p className="intro-description">Small moments. Everyday artifacts. Things you almost forgot<br className="desktop-break" /> were worth keeping.</p>
                    </div>
                    <div className="intro-stamp" aria-label={`${exhibits.length} exhibits collected`}>
                        <span className="stamp-number">{String(exhibits.length).padStart(2, "0")}</span>
                        <span className="stamp-label">THINGS<br />COLLECTED</span>
                        <span className="stamp-star" aria-hidden="true">✳</span>
                    </div>
                </section>

                {activeView === "connections" ? (
                    <section className="connections-section" aria-label="Room of Strange Connections">
                        <div className="connections-heading">
                            <p className="eyebrow"><span className="eyebrow-line" /> THE ROOM OF STRANGE CONNECTIONS</p>
                            <h2>Two things. One thread<span className="title-period">.</span></h2>
                            <p className="connections-intro">The museum has put two things side by side. You decide what brings them together.</p>
                        </div>

                        {drawnExhibits.length === 2 ? (
                            <div className="connection-draw">
                                <div className="connection-pair">
                                    {drawnExhibits.map((exhibit, index) => (
                                        <article className="pair-exhibit" key={exhibit.id}>
                                            <div className={`pair-image pair-image-${index}`}>
                                                {exhibit.image ? <img src={exhibit.image} alt="" /> : <span aria-hidden="true">✳</span>}
                                            </div>
                                            <div className="exhibit-meta"><span>{exhibit.category}</span><span className="meta-dot">·</span><span>{exhibit.place}</span></div>
                                            <h3>{exhibit.title}</h3>
                                        </article>
                                    ))}
                                    <span className="pair-connector" aria-hidden="true">✳</span>
                                </div>
                                <form className="reflection-form" onSubmit={saveConnection}>
                                    <label htmlFor="connection-reflection">What could these two have in common?</label>
                                    <textarea id="connection-reflection" name="reflection" required maxLength="300" rows="2" placeholder="Maybe they both remind me to slow down..." />
                                    <div className="reflection-actions">
                                        <button className="draw-again-button" type="button" onClick={drawConnectionPair}>Draw another pair <span aria-hidden="true">↻</span></button>
                                        <button className="submit-button" type="submit">Keep this thread <span aria-hidden="true">↗</span></button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="connection-empty">
                                <span aria-hidden="true">✳</span>
                                <h3>Every thread starts with two things.</h3>
                                <p>Add at least two exhibits to let the museum make a surprising pairing.</p>
                                <button className="add-button" onClick={() => setIsAdding(true)}><span aria-hidden="true">+</span> Add an exhibit</button>
                            </div>
                        )}

                        <div className="saved-threads">
                            <div className="saved-threads-heading">
                                <div><h3>Threads you found</h3><p>{savedConnections.length} saved {savedConnections.length === 1 ? "connection" : "connections"}</p></div>
                            </div>
                            {savedConnections.length ? (
                                <div className="thread-list">
                                    {savedConnections.map((connection) => {
                                        const pair = connection.exhibitIds.map((id) => exhibits.find((exhibit) => exhibit.id === id));
                                        return (
                                            <article className="thread-entry" key={connection.id}>
                                                <div className="thread-artifacts">
                                                    {pair.map((exhibit) => <button key={exhibit.id} onClick={() => setSelectedExhibit(exhibit)}>{exhibit.title}</button>)}
                                                </div>
                                                <span className="thread-symbol" aria-hidden="true">↔</span>
                                                <p>{connection.reflection}</p>
                                                <span className="thread-date">{formatDate(connection.createdAt)}</span>
                                            </article>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="no-threads">No threads yet. The first one might surprise you.</p>
                            )}
                        </div>
                    </section>
                ) : (
                <section className="collection-section" aria-label="Exhibit collection">
                    <div className="section-heading">
                        <div>
                            <h2>{activeView === "favorites" ? "Your favorites" : "The collection"}</h2>
                            <p>{visibleExhibits.length === 1 ? "1 exhibit" : `${visibleExhibits.length} exhibits`} <span className="heading-dot">·</span> each one a little world</p>
                        </div>
                        <button className="surprise-button" onClick={openSurprise} disabled={!visibleExhibits.length}>
                            <span aria-hidden="true">✳</span> Surprise me
                        </button>
                    </div>

                    <div className="collection-tools">
                        <div className="category-tabs" aria-label="Filter by category">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    className={activeCategory === category ? "category-tab selected" : "category-tab"}
                                    onClick={() => setActiveCategory(category)}
                                >{category}</button>
                            ))}
                        </div>
                        <label className="search-box">
                            <span aria-hidden="true">⌕</span>
                            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find an exhibit" aria-label="Search exhibits" />
                            <kbd>/</kbd>
                        </label>
                    </div>

                    {visibleExhibits.length ? (
                        <div className="exhibit-grid">
                            {visibleExhibits.map((exhibit, index) => (
                                <article className={`exhibit-card${index === 0 ? " featured-card" : ""}`} key={exhibit.id}>
                                    <div className={`exhibit-image image-${index % 5}`}>
                                        {exhibit.image ? <img src={exhibit.image} alt="" loading={index > 2 ? "lazy" : "eager"} /> : <span className="image-placeholder" aria-hidden="true">✳</span>}
                                        <span className="image-date">{formatDate(exhibit.date)}</span>
                                        <button className={exhibit.favorite ? "favorite-button is-favorite" : "favorite-button"} onClick={() => toggleFavorite(exhibit.id)} aria-label={exhibit.favorite ? "Remove from favorites" : "Add to favorites"} aria-pressed={exhibit.favorite}>
                                            {exhibit.favorite ? "♥" : "♡"}
                                        </button>
                                        <button className="image-open" onClick={() => setSelectedExhibit(exhibit)} aria-label={`Open ${exhibit.title}`} />
                                    </div>
                                    <div className="exhibit-caption">
                                        <div className="exhibit-meta"><span>{exhibit.category}</span><span className="meta-dot">·</span><span>{exhibit.place}</span></div>
                                        <button className="exhibit-title" onClick={() => setSelectedExhibit(exhibit)}>{exhibit.title}</button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <span aria-hidden="true">✳</span>
                            <h3>Nothing on this wall just yet.</h3>
                            <p>Try another filter, or add the first thing to your collection.</p>
                            <button className="add-button" onClick={() => setIsAdding(true)}>+ Add an exhibit</button>
                        </div>
                    )}
                </section>
                )}

                <footer className="page-footer"><span>TAKE YOUR TIME IN HERE.</span><span>MADE OF LITTLE THINGS <span className="footer-heart">♥</span></span></footer>
            </main>

            {isAdding && (
                <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setIsAdding(false)}>
                    <section className="dialog-panel" role="dialog" aria-modal="true" aria-labelledby="add-title">
                        <button className="dialog-close" onClick={() => setIsAdding(false)} aria-label="Close">×</button>
                        <p className="eyebrow"><span className="eyebrow-line" /> NEW ACQUISITION</p>
                        <h2 id="add-title">Add to the collection<span className="title-period">.</span></h2>
                        <p className="dialog-intro">What would you like to remember?</p>
                        <form className="exhibit-form" onSubmit={addExhibit}>
                            <label className="form-field full-field">Exhibit title<input name="title" required maxLength="80" placeholder="The song from the open window" /></label>
                            <div className="form-row">
                                <label className="form-field">Kind of thing<select name="category" defaultValue="Moments"><option>Objects</option><option>Moments</option><option>Places</option><option>Notes</option></select></label>
                                <label className="form-field">When<input name="date" type="date" required defaultValue={today} /></label>
                            </div>
                            <label className="form-field full-field">Where was it?<input name="place" maxLength="80" placeholder="A place, a pocket, a passing thought" /></label>
                            <label className="form-field full-field">The story<textarea name="story" required rows="3" maxLength="500" placeholder="The detail you don't want to lose..." /></label>
                            <label className="form-field full-field">Image URL <span className="optional-label">OPTIONAL</span><input name="image" type="url" placeholder="https://..." /></label>
                            <button className="submit-button" type="submit">Place it in the museum <span aria-hidden="true">↗</span></button>
                        </form>
                    </section>
                </div>
            )}

            {selectedExhibit && (
                <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setSelectedExhibit(null)}>
                    <section className="detail-panel" role="dialog" aria-modal="true" aria-labelledby="detail-title">
                        <button className="dialog-close detail-close" onClick={() => setSelectedExhibit(null)} aria-label="Close">×</button>
                        <div className="detail-image">
                            {selectedExhibit.image ? <img src={selectedExhibit.image} alt="" /> : <span aria-hidden="true">✳</span>}
                        </div>
                        <div className="detail-copy">
                            <div className="exhibit-meta"><span>{selectedExhibit.category}</span><span className="meta-dot">·</span><span>{formatDate(selectedExhibit.date)}</span></div>
                            <h2 id="detail-title">{selectedExhibit.title}</h2>
                            <p className="detail-place">{selectedExhibit.place}</p>
                            <p className="detail-story">{selectedExhibit.story}</p>
                            <button className="detail-favorite" onClick={() => toggleFavorite(selectedExhibit.id)}>{selectedExhibit.favorite ? "♥ Saved to favorites" : "♡ Save to favorites"}</button>
                            {connections.some((connection) => connection.exhibitIds.includes(selectedExhibit.id)) && (
                                <div className="detail-threads">
                                    <p>THREADS IN THIS EXHIBIT</p>
                                    {connections.filter((connection) => connection.exhibitIds.includes(selectedExhibit.id)).map((connection) => {
                                        const otherId = connection.exhibitIds.find((id) => id !== selectedExhibit.id);
                                        const otherExhibit = exhibits.find((exhibit) => exhibit.id === otherId);
                                        if (!otherExhibit) return null;
                                        return (
                                            <button key={connection.id} onClick={() => setSelectedExhibit(otherExhibit)}>
                                                <span>↔ {otherExhibit.title}</span>
                                                <span>{connection.reflection}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}

export default App;
