
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.6' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/MenuButton.svelte generated by Svelte v3.46.6 */

    const file$8 = "src/MenuButton.svelte";

    function create_fragment$9(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "button");
    			input.value = /*change*/ ctx[1];
    			add_location(input, file$8, 5, 0, 58);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*change*/ 2) {
    				prop_dev(input, "value", /*change*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MenuButton', slots, []);
    	let { change } = $$props;
    	let { screen } = $$props;
    	const writable_props = ['change', 'screen'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MenuButton> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(0, screen = change);
    	};

    	$$self.$$set = $$props => {
    		if ('change' in $$props) $$invalidate(1, change = $$props.change);
    		if ('screen' in $$props) $$invalidate(0, screen = $$props.screen);
    	};

    	$$self.$capture_state = () => ({ change, screen });

    	$$self.$inject_state = $$props => {
    		if ('change' in $$props) $$invalidate(1, change = $$props.change);
    		if ('screen' in $$props) $$invalidate(0, screen = $$props.screen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [screen, change, click_handler];
    }

    class MenuButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { change: 1, screen: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MenuButton",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*change*/ ctx[1] === undefined && !('change' in props)) {
    			console.warn("<MenuButton> was created without expected prop 'change'");
    		}

    		if (/*screen*/ ctx[0] === undefined && !('screen' in props)) {
    			console.warn("<MenuButton> was created without expected prop 'screen'");
    		}
    	}

    	get change() {
    		throw new Error("<MenuButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set change(value) {
    		throw new Error("<MenuButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get screen() {
    		throw new Error("<MenuButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set screen(value) {
    		throw new Error("<MenuButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/MainMenu.svelte generated by Svelte v3.46.6 */

    function create_fragment$8(ctx) {
    	let menubutton0;
    	let updating_screen;
    	let t0;
    	let menubutton1;
    	let updating_screen_1;
    	let t1;
    	let menubutton2;
    	let updating_screen_2;
    	let current;

    	function menubutton0_screen_binding(value) {
    		/*menubutton0_screen_binding*/ ctx[1](value);
    	}

    	let menubutton0_props = { change: "Player Guess" };

    	if (/*screen*/ ctx[0] !== void 0) {
    		menubutton0_props.screen = /*screen*/ ctx[0];
    	}

    	menubutton0 = new MenuButton({ props: menubutton0_props, $$inline: true });
    	binding_callbacks.push(() => bind(menubutton0, 'screen', menubutton0_screen_binding));

    	function menubutton1_screen_binding(value) {
    		/*menubutton1_screen_binding*/ ctx[2](value);
    	}

    	let menubutton1_props = { change: "Computer Guess" };

    	if (/*screen*/ ctx[0] !== void 0) {
    		menubutton1_props.screen = /*screen*/ ctx[0];
    	}

    	menubutton1 = new MenuButton({ props: menubutton1_props, $$inline: true });
    	binding_callbacks.push(() => bind(menubutton1, 'screen', menubutton1_screen_binding));

    	function menubutton2_screen_binding(value) {
    		/*menubutton2_screen_binding*/ ctx[3](value);
    	}

    	let menubutton2_props = { change: "Config" };

    	if (/*screen*/ ctx[0] !== void 0) {
    		menubutton2_props.screen = /*screen*/ ctx[0];
    	}

    	menubutton2 = new MenuButton({ props: menubutton2_props, $$inline: true });
    	binding_callbacks.push(() => bind(menubutton2, 'screen', menubutton2_screen_binding));

    	const block = {
    		c: function create() {
    			create_component(menubutton0.$$.fragment);
    			t0 = space();
    			create_component(menubutton1.$$.fragment);
    			t1 = space();
    			create_component(menubutton2.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(menubutton0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(menubutton1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(menubutton2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const menubutton0_changes = {};

    			if (!updating_screen && dirty & /*screen*/ 1) {
    				updating_screen = true;
    				menubutton0_changes.screen = /*screen*/ ctx[0];
    				add_flush_callback(() => updating_screen = false);
    			}

    			menubutton0.$set(menubutton0_changes);
    			const menubutton1_changes = {};

    			if (!updating_screen_1 && dirty & /*screen*/ 1) {
    				updating_screen_1 = true;
    				menubutton1_changes.screen = /*screen*/ ctx[0];
    				add_flush_callback(() => updating_screen_1 = false);
    			}

    			menubutton1.$set(menubutton1_changes);
    			const menubutton2_changes = {};

    			if (!updating_screen_2 && dirty & /*screen*/ 1) {
    				updating_screen_2 = true;
    				menubutton2_changes.screen = /*screen*/ ctx[0];
    				add_flush_callback(() => updating_screen_2 = false);
    			}

    			menubutton2.$set(menubutton2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menubutton0.$$.fragment, local);
    			transition_in(menubutton1.$$.fragment, local);
    			transition_in(menubutton2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menubutton0.$$.fragment, local);
    			transition_out(menubutton1.$$.fragment, local);
    			transition_out(menubutton2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menubutton0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(menubutton1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(menubutton2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MainMenu', slots, []);
    	let { screen } = $$props;
    	const writable_props = ['screen'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MainMenu> was created with unknown prop '${key}'`);
    	});

    	function menubutton0_screen_binding(value) {
    		screen = value;
    		$$invalidate(0, screen);
    	}

    	function menubutton1_screen_binding(value) {
    		screen = value;
    		$$invalidate(0, screen);
    	}

    	function menubutton2_screen_binding(value) {
    		screen = value;
    		$$invalidate(0, screen);
    	}

    	$$self.$$set = $$props => {
    		if ('screen' in $$props) $$invalidate(0, screen = $$props.screen);
    	};

    	$$self.$capture_state = () => ({ MenuButton, screen });

    	$$self.$inject_state = $$props => {
    		if ('screen' in $$props) $$invalidate(0, screen = $$props.screen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		screen,
    		menubutton0_screen_binding,
    		menubutton1_screen_binding,
    		menubutton2_screen_binding
    	];
    }

    class MainMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { screen: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MainMenu",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*screen*/ ctx[0] === undefined && !('screen' in props)) {
    			console.warn("<MainMenu> was created without expected prop 'screen'");
    		}
    	}

    	get screen() {
    		throw new Error("<MainMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set screen(value) {
    		throw new Error("<MainMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/ConfigInput.svelte generated by Svelte v3.46.6 */

    const file$7 = "src/ConfigInput.svelte";

    function create_fragment$7(ctx) {
    	let label_1;
    	let t0;
    	let t1;
    	let input;
    	let input_value_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label_1 = element("label");
    			t0 = text(/*label*/ ctx[1]);
    			t1 = space();
    			input = element("input");
    			attr_dev(label_1, "for", /*type*/ ctx[2]);
    			add_location(label_1, file$7, 7, 0, 99);
    			attr_dev(input, "id", /*type*/ ctx[2]);
    			attr_dev(input, "type", "number");
    			input.value = input_value_value = /*config*/ ctx[0][/*type*/ ctx[2]];
    			add_location(input, file$7, 8, 0, 133);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label_1, anchor);
    			append_dev(label_1, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*change_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*label*/ 2) set_data_dev(t0, /*label*/ ctx[1]);

    			if (dirty & /*type*/ 4) {
    				attr_dev(label_1, "for", /*type*/ ctx[2]);
    			}

    			if (dirty & /*type*/ 4) {
    				attr_dev(input, "id", /*type*/ ctx[2]);
    			}

    			if (dirty & /*config, type*/ 5 && input_value_value !== (input_value_value = /*config*/ ctx[0][/*type*/ ctx[2]]) && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label_1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ConfigInput', slots, []);
    	let { config } = $$props;
    	let { label } = $$props;
    	let { type } = $$props;
    	let { updateConfig } = $$props;
    	const writable_props = ['config', 'label', 'type', 'updateConfig'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ConfigInput> was created with unknown prop '${key}'`);
    	});

    	const change_handler = event => {
    		let updated = config;
    		$$invalidate(0, config[type] = event.target.value, config);
    		updateConfig(updated);
    	};

    	$$self.$$set = $$props => {
    		if ('config' in $$props) $$invalidate(0, config = $$props.config);
    		if ('label' in $$props) $$invalidate(1, label = $$props.label);
    		if ('type' in $$props) $$invalidate(2, type = $$props.type);
    		if ('updateConfig' in $$props) $$invalidate(3, updateConfig = $$props.updateConfig);
    	};

    	$$self.$capture_state = () => ({ config, label, type, updateConfig });

    	$$self.$inject_state = $$props => {
    		if ('config' in $$props) $$invalidate(0, config = $$props.config);
    		if ('label' in $$props) $$invalidate(1, label = $$props.label);
    		if ('type' in $$props) $$invalidate(2, type = $$props.type);
    		if ('updateConfig' in $$props) $$invalidate(3, updateConfig = $$props.updateConfig);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [config, label, type, updateConfig, change_handler];
    }

    class ConfigInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			config: 0,
    			label: 1,
    			type: 2,
    			updateConfig: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ConfigInput",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*config*/ ctx[0] === undefined && !('config' in props)) {
    			console.warn("<ConfigInput> was created without expected prop 'config'");
    		}

    		if (/*label*/ ctx[1] === undefined && !('label' in props)) {
    			console.warn("<ConfigInput> was created without expected prop 'label'");
    		}

    		if (/*type*/ ctx[2] === undefined && !('type' in props)) {
    			console.warn("<ConfigInput> was created without expected prop 'type'");
    		}

    		if (/*updateConfig*/ ctx[3] === undefined && !('updateConfig' in props)) {
    			console.warn("<ConfigInput> was created without expected prop 'updateConfig'");
    		}
    	}

    	get config() {
    		throw new Error("<ConfigInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set config(value) {
    		throw new Error("<ConfigInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<ConfigInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<ConfigInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<ConfigInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<ConfigInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get updateConfig() {
    		throw new Error("<ConfigInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set updateConfig(value) {
    		throw new Error("<ConfigInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Config.svelte generated by Svelte v3.46.6 */
    const file$6 = "src/Config.svelte";

    function create_fragment$6(ctx) {
    	let configinput0;
    	let t0;
    	let configinput1;
    	let t1;
    	let configinput2;
    	let t2;
    	let p;
    	let t4;
    	let menubutton;
    	let updating_screen;
    	let current;

    	configinput0 = new ConfigInput({
    			props: {
    				config: /*config*/ ctx[1],
    				label: "Range: min",
    				type: "min",
    				updateConfig: /*updateConfig*/ ctx[2]
    			},
    			$$inline: true
    		});

    	configinput1 = new ConfigInput({
    			props: {
    				config: /*config*/ ctx[1],
    				label: "Range: max",
    				type: "max",
    				updateConfig: /*updateConfig*/ ctx[2]
    			},
    			$$inline: true
    		});

    	configinput2 = new ConfigInput({
    			props: {
    				config: /*config*/ ctx[1],
    				label: "Secret number",
    				type: "secret",
    				updateConfig: /*updateConfig*/ ctx[2]
    			},
    			$$inline: true
    		});

    	function menubutton_screen_binding(value) {
    		/*menubutton_screen_binding*/ ctx[3](value);
    	}

    	let menubutton_props = { change: "Main Menu" };

    	if (/*screen*/ ctx[0] !== void 0) {
    		menubutton_props.screen = /*screen*/ ctx[0];
    	}

    	menubutton = new MenuButton({ props: menubutton_props, $$inline: true });
    	binding_callbacks.push(() => bind(menubutton, 'screen', menubutton_screen_binding));

    	const block = {
    		c: function create() {
    			create_component(configinput0.$$.fragment);
    			t0 = space();
    			create_component(configinput1.$$.fragment);
    			t1 = space();
    			create_component(configinput2.$$.fragment);
    			t2 = space();
    			p = element("p");
    			p.textContent = "Your input will be ignored if any of your values aren't numbers, if your\nmin value is not less than your max value, or if your secret is outside your\nrange. They're supposed to be integers, so any decimal will be rounded down.";
    			t4 = space();
    			create_component(menubutton.$$.fragment);
    			attr_dev(p, "class", "svelte-ihkond");
    			add_location(p, file$6, 30, 0, 409);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(configinput0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(configinput1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(configinput2, target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(menubutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const configinput0_changes = {};
    			if (dirty & /*config*/ 2) configinput0_changes.config = /*config*/ ctx[1];
    			if (dirty & /*updateConfig*/ 4) configinput0_changes.updateConfig = /*updateConfig*/ ctx[2];
    			configinput0.$set(configinput0_changes);
    			const configinput1_changes = {};
    			if (dirty & /*config*/ 2) configinput1_changes.config = /*config*/ ctx[1];
    			if (dirty & /*updateConfig*/ 4) configinput1_changes.updateConfig = /*updateConfig*/ ctx[2];
    			configinput1.$set(configinput1_changes);
    			const configinput2_changes = {};
    			if (dirty & /*config*/ 2) configinput2_changes.config = /*config*/ ctx[1];
    			if (dirty & /*updateConfig*/ 4) configinput2_changes.updateConfig = /*updateConfig*/ ctx[2];
    			configinput2.$set(configinput2_changes);
    			const menubutton_changes = {};

    			if (!updating_screen && dirty & /*screen*/ 1) {
    				updating_screen = true;
    				menubutton_changes.screen = /*screen*/ ctx[0];
    				add_flush_callback(() => updating_screen = false);
    			}

    			menubutton.$set(menubutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(configinput0.$$.fragment, local);
    			transition_in(configinput1.$$.fragment, local);
    			transition_in(configinput2.$$.fragment, local);
    			transition_in(menubutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(configinput0.$$.fragment, local);
    			transition_out(configinput1.$$.fragment, local);
    			transition_out(configinput2.$$.fragment, local);
    			transition_out(menubutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(configinput0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(configinput1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(configinput2, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t4);
    			destroy_component(menubutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Config', slots, []);
    	let { screen } = $$props;
    	let { config } = $$props;
    	let { updateConfig } = $$props;
    	const writable_props = ['screen', 'config', 'updateConfig'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Config> was created with unknown prop '${key}'`);
    	});

    	function menubutton_screen_binding(value) {
    		screen = value;
    		$$invalidate(0, screen);
    	}

    	$$self.$$set = $$props => {
    		if ('screen' in $$props) $$invalidate(0, screen = $$props.screen);
    		if ('config' in $$props) $$invalidate(1, config = $$props.config);
    		if ('updateConfig' in $$props) $$invalidate(2, updateConfig = $$props.updateConfig);
    	};

    	$$self.$capture_state = () => ({
    		MenuButton,
    		ConfigInput,
    		screen,
    		config,
    		updateConfig
    	});

    	$$self.$inject_state = $$props => {
    		if ('screen' in $$props) $$invalidate(0, screen = $$props.screen);
    		if ('config' in $$props) $$invalidate(1, config = $$props.config);
    		if ('updateConfig' in $$props) $$invalidate(2, updateConfig = $$props.updateConfig);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [screen, config, updateConfig, menubutton_screen_binding];
    }

    class Config extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { screen: 0, config: 1, updateConfig: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Config",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*screen*/ ctx[0] === undefined && !('screen' in props)) {
    			console.warn("<Config> was created without expected prop 'screen'");
    		}

    		if (/*config*/ ctx[1] === undefined && !('config' in props)) {
    			console.warn("<Config> was created without expected prop 'config'");
    		}

    		if (/*updateConfig*/ ctx[2] === undefined && !('updateConfig' in props)) {
    			console.warn("<Config> was created without expected prop 'updateConfig'");
    		}
    	}

    	get screen() {
    		throw new Error("<Config>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set screen(value) {
    		throw new Error("<Config>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get config() {
    		throw new Error("<Config>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set config(value) {
    		throw new Error("<Config>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get updateConfig() {
    		throw new Error("<Config>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set updateConfig(value) {
    		throw new Error("<Config>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/GuessInput.svelte generated by Svelte v3.46.6 */

    const file$5 = "src/GuessInput.svelte";

    function create_fragment$5(ctx) {
    	let p;
    	let t0;
    	let t1;
    	let t2;
    	let input0;
    	let t3;
    	let input1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Guesses: ");
    			t1 = text(/*guesses*/ ctx[0]);
    			t2 = space();
    			input0 = element("input");
    			t3 = space();
    			input1 = element("input");
    			add_location(p, file$5, 10, 0, 199);
    			attr_dev(input0, "id", "guessInputNumber");
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "placeholder", "Guess a number.");
    			add_location(input0, file$5, 12, 0, 226);
    			attr_dev(input1, "type", "button");
    			input1.value = "Submit";
    			add_location(input1, file$5, 17, 0, 304);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, input0, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, input1, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input1, "click", /*tryGuess*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*guesses*/ 1) set_data_dev(t1, /*guesses*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(input1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GuessInput', slots, []);
    	let { guesses } = $$props;
    	let { handleGuess } = $$props;

    	function tryGuess() {
    		let num = parseInt(document.getElementById("guessInputNumber").value);
    		if (!isNaN(num)) handleGuess(num);
    	}

    	const writable_props = ['guesses', 'handleGuess'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GuessInput> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('guesses' in $$props) $$invalidate(0, guesses = $$props.guesses);
    		if ('handleGuess' in $$props) $$invalidate(2, handleGuess = $$props.handleGuess);
    	};

    	$$self.$capture_state = () => ({ guesses, handleGuess, tryGuess });

    	$$self.$inject_state = $$props => {
    		if ('guesses' in $$props) $$invalidate(0, guesses = $$props.guesses);
    		if ('handleGuess' in $$props) $$invalidate(2, handleGuess = $$props.handleGuess);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [guesses, tryGuess, handleGuess];
    }

    class GuessInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { guesses: 0, handleGuess: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GuessInput",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*guesses*/ ctx[0] === undefined && !('guesses' in props)) {
    			console.warn("<GuessInput> was created without expected prop 'guesses'");
    		}

    		if (/*handleGuess*/ ctx[2] === undefined && !('handleGuess' in props)) {
    			console.warn("<GuessInput> was created without expected prop 'handleGuess'");
    		}
    	}

    	get guesses() {
    		throw new Error("<GuessInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set guesses(value) {
    		throw new Error("<GuessInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleGuess() {
    		throw new Error("<GuessInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleGuess(value) {
    		throw new Error("<GuessInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Player.svelte generated by Svelte v3.46.6 */
    const file$4 = "src/Player.svelte";

    // (42:0) {:else}
    function create_else_block$1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "button");
    			input.value = "Back";
    			add_location(input, file$4, 42, 1, 1051);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "click", /*click_handler*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(42:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (40:0) {#if state == "play"}
    function create_if_block$2(ctx) {
    	let guessinput;
    	let current;

    	guessinput = new GuessInput({
    			props: {
    				guesses: /*guesses*/ ctx[1],
    				handleGuess: /*handleGuess*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(guessinput.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(guessinput, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const guessinput_changes = {};
    			if (dirty & /*guesses*/ 2) guessinput_changes.guesses = /*guesses*/ ctx[1];
    			guessinput.$set(guessinput_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(guessinput.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(guessinput.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(guessinput, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(40:0) {#if state == \\\"play\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let p;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*state*/ ctx[2] == "play") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "The computer has picked a number. Try a guess. You will be told whether your\nguess is higher, lower, or equal to the correct number.";
    			t1 = space();
    			if_block.c();
    			if_block_anchor = empty();
    			attr_dev(p, "id", "status");
    			add_location(p, file$4, 36, 0, 827);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Player', slots, []);
    	let { config } = $$props;
    	let { handleWin } = $$props;
    	let { getPerformance } = $$props;
    	let { screen } = $$props;
    	let guesses = 0;
    	let answer = Math.round(Math.random() * (config.max - config.min)) + config.min;
    	let state = "play";
    	let performance;

    	const handleGuess = guess => {
    		let relation;
    		let status = document.getElementById("status");
    		$$invalidate(1, guesses++, guesses);

    		if (guess > answer) relation = "higher"; else if (guess < answer) relation = "lower"; else {
    			let performance = getPerformance(guesses);
    			status.innerHTML = `You guessed correctly: ${guess}! You needed ${guesses} guesses, which counts as ${performance} performance.`;
    			handleWin("player", performance);
    			$$invalidate(2, state = "done");
    			return;
    		}

    		status.innerHTML = `Your guess, ${guess}, is ${relation} than the answer.`;
    	};

    	const writable_props = ['config', 'handleWin', 'getPerformance', 'screen'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Player> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, screen = "Main Menu");

    	$$self.$$set = $$props => {
    		if ('config' in $$props) $$invalidate(4, config = $$props.config);
    		if ('handleWin' in $$props) $$invalidate(5, handleWin = $$props.handleWin);
    		if ('getPerformance' in $$props) $$invalidate(6, getPerformance = $$props.getPerformance);
    		if ('screen' in $$props) $$invalidate(0, screen = $$props.screen);
    	};

    	$$self.$capture_state = () => ({
    		GuessInput,
    		config,
    		handleWin,
    		getPerformance,
    		screen,
    		guesses,
    		answer,
    		state,
    		performance,
    		handleGuess
    	});

    	$$self.$inject_state = $$props => {
    		if ('config' in $$props) $$invalidate(4, config = $$props.config);
    		if ('handleWin' in $$props) $$invalidate(5, handleWin = $$props.handleWin);
    		if ('getPerformance' in $$props) $$invalidate(6, getPerformance = $$props.getPerformance);
    		if ('screen' in $$props) $$invalidate(0, screen = $$props.screen);
    		if ('guesses' in $$props) $$invalidate(1, guesses = $$props.guesses);
    		if ('answer' in $$props) answer = $$props.answer;
    		if ('state' in $$props) $$invalidate(2, state = $$props.state);
    		if ('performance' in $$props) performance = $$props.performance;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		screen,
    		guesses,
    		state,
    		handleGuess,
    		config,
    		handleWin,
    		getPerformance,
    		click_handler
    	];
    }

    class Player extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			config: 4,
    			handleWin: 5,
    			getPerformance: 6,
    			screen: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Player",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*config*/ ctx[4] === undefined && !('config' in props)) {
    			console.warn("<Player> was created without expected prop 'config'");
    		}

    		if (/*handleWin*/ ctx[5] === undefined && !('handleWin' in props)) {
    			console.warn("<Player> was created without expected prop 'handleWin'");
    		}

    		if (/*getPerformance*/ ctx[6] === undefined && !('getPerformance' in props)) {
    			console.warn("<Player> was created without expected prop 'getPerformance'");
    		}

    		if (/*screen*/ ctx[0] === undefined && !('screen' in props)) {
    			console.warn("<Player> was created without expected prop 'screen'");
    		}
    	}

    	get config() {
    		throw new Error("<Player>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set config(value) {
    		throw new Error("<Player>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleWin() {
    		throw new Error("<Player>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleWin(value) {
    		throw new Error("<Player>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getPerformance() {
    		throw new Error("<Player>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getPerformance(value) {
    		throw new Error("<Player>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get screen() {
    		throw new Error("<Player>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set screen(value) {
    		throw new Error("<Player>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Computer.svelte generated by Svelte v3.46.6 */

    const file$3 = "src/Computer.svelte";

    // (64:0) {:else}
    function create_else_block(ctx) {
    	let p;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("The computer used ");
    			t1 = text(/*guesses*/ ctx[2]);
    			t2 = text(" guesses. This counts as ");
    			t3 = text(/*performance*/ ctx[4]);
    			t4 = text("\n\tperformance.");
    			t5 = space();
    			input = element("input");
    			add_location(p, file$3, 64, 1, 1083);
    			attr_dev(input, "type", "button");
    			input.value = "Back";
    			add_location(input, file$3, 67, 1, 1172);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(p, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "click", /*click_handler_2*/ ctx[14], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*guesses*/ 4) set_data_dev(t1, /*guesses*/ ctx[2]);
    			if (dirty & /*performance*/ 16) set_data_dev(t3, /*performance*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(64:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (40:0) {#if state == "play"}
    function create_if_block$1(ctx) {
    	let p;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let input0;
    	let input0_disabled_value;
    	let t6;
    	let input1;
    	let input1_disabled_value;
    	let t7;
    	let input2;
    	let input2_disabled_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Guess #");
    			t1 = text(/*guesses*/ ctx[2]);
    			t2 = text(": the computer guesses the number \"");
    			t3 = text(/*guess*/ ctx[1]);
    			t4 = text("\". What's the\n\tguess's relationship with your secret number?");
    			t5 = space();
    			input0 = element("input");
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			input2 = element("input");
    			add_location(p, file$3, 40, 1, 642);
    			attr_dev(input0, "type", "button");
    			input0.value = "Too low";
    			input0.disabled = input0_disabled_value = !/*enabled*/ ctx[5].low;
    			add_location(input0, file$3, 43, 1, 770);
    			attr_dev(input1, "type", "button");
    			input1.value = "Equal";
    			input1.disabled = input1_disabled_value = !/*enabled*/ ctx[5].equal;
    			add_location(input1, file$3, 50, 1, 876);
    			attr_dev(input2, "type", "button");
    			input2.value = "Too high";
    			input2.disabled = input2_disabled_value = !/*enabled*/ ctx[5].high;
    			add_location(input2, file$3, 57, 1, 967);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(p, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, input0, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, input1, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, input2, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "click", /*click_handler*/ ctx[12], false, false, false),
    					listen_dev(input1, "click", /*equal*/ ctx[6], false, false, false),
    					listen_dev(input2, "click", /*click_handler_1*/ ctx[13], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*guesses*/ 4) set_data_dev(t1, /*guesses*/ ctx[2]);
    			if (dirty & /*guess*/ 2) set_data_dev(t3, /*guess*/ ctx[1]);

    			if (dirty & /*enabled*/ 32 && input0_disabled_value !== (input0_disabled_value = !/*enabled*/ ctx[5].low)) {
    				prop_dev(input0, "disabled", input0_disabled_value);
    			}

    			if (dirty & /*enabled*/ 32 && input1_disabled_value !== (input1_disabled_value = !/*enabled*/ ctx[5].equal)) {
    				prop_dev(input1, "disabled", input1_disabled_value);
    			}

    			if (dirty & /*enabled*/ 32 && input2_disabled_value !== (input2_disabled_value = !/*enabled*/ ctx[5].high)) {
    				prop_dev(input2, "disabled", input2_disabled_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(input1);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(input2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(40:0) {#if state == \\\"play\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*state*/ ctx[3] == "play") return create_if_block$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let guess;
    	let enabled;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Computer', slots, []);
    	let { config } = $$props;
    	let { screen } = $$props;
    	let { handleWin } = $$props;
    	let { getPerformance } = $$props;
    	let range = { min: config.min, max: config.max };
    	let guesses = 1;
    	let state = "play";
    	let performance;

    	const equal = () => {
    		$$invalidate(4, performance = getPerformance(guesses));
    		handleWin("computer", performance);
    		$$invalidate(3, state = "done");
    	};

    	const unequal = rel => {
    		$$invalidate(2, guesses++, guesses);
    		if (rel == "low") $$invalidate(11, range.min = guess + 1, range); else $$invalidate(11, range.max = guess - 1, range);
    	};

    	const writable_props = ['config', 'screen', 'handleWin', 'getPerformance'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Computer> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => unequal("low");
    	const click_handler_1 = () => unequal("high");
    	const click_handler_2 = () => $$invalidate(0, screen = "Main Menu");

    	$$self.$$set = $$props => {
    		if ('config' in $$props) $$invalidate(8, config = $$props.config);
    		if ('screen' in $$props) $$invalidate(0, screen = $$props.screen);
    		if ('handleWin' in $$props) $$invalidate(9, handleWin = $$props.handleWin);
    		if ('getPerformance' in $$props) $$invalidate(10, getPerformance = $$props.getPerformance);
    	};

    	$$self.$capture_state = () => ({
    		config,
    		screen,
    		handleWin,
    		getPerformance,
    		range,
    		guesses,
    		state,
    		performance,
    		equal,
    		unequal,
    		guess,
    		enabled
    	});

    	$$self.$inject_state = $$props => {
    		if ('config' in $$props) $$invalidate(8, config = $$props.config);
    		if ('screen' in $$props) $$invalidate(0, screen = $$props.screen);
    		if ('handleWin' in $$props) $$invalidate(9, handleWin = $$props.handleWin);
    		if ('getPerformance' in $$props) $$invalidate(10, getPerformance = $$props.getPerformance);
    		if ('range' in $$props) $$invalidate(11, range = $$props.range);
    		if ('guesses' in $$props) $$invalidate(2, guesses = $$props.guesses);
    		if ('state' in $$props) $$invalidate(3, state = $$props.state);
    		if ('performance' in $$props) $$invalidate(4, performance = $$props.performance);
    		if ('guess' in $$props) $$invalidate(1, guess = $$props.guess);
    		if ('enabled' in $$props) $$invalidate(5, enabled = $$props.enabled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*range*/ 2048) {
    			$$invalidate(1, guess = Math.round((range.min + range.max) / 2));
    		}

    		if ($$self.$$.dirty & /*guess, config*/ 258) {
    			$$invalidate(5, enabled = {
    				low: guess < config.secret,
    				equal: guess == config.secret,
    				high: guess > config.secret
    			});
    		}
    	};

    	return [
    		screen,
    		guess,
    		guesses,
    		state,
    		performance,
    		enabled,
    		equal,
    		unequal,
    		config,
    		handleWin,
    		getPerformance,
    		range,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class Computer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			config: 8,
    			screen: 0,
    			handleWin: 9,
    			getPerformance: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Computer",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*config*/ ctx[8] === undefined && !('config' in props)) {
    			console.warn("<Computer> was created without expected prop 'config'");
    		}

    		if (/*screen*/ ctx[0] === undefined && !('screen' in props)) {
    			console.warn("<Computer> was created without expected prop 'screen'");
    		}

    		if (/*handleWin*/ ctx[9] === undefined && !('handleWin' in props)) {
    			console.warn("<Computer> was created without expected prop 'handleWin'");
    		}

    		if (/*getPerformance*/ ctx[10] === undefined && !('getPerformance' in props)) {
    			console.warn("<Computer> was created without expected prop 'getPerformance'");
    		}
    	}

    	get config() {
    		throw new Error("<Computer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set config(value) {
    		throw new Error("<Computer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get screen() {
    		throw new Error("<Computer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set screen(value) {
    		throw new Error("<Computer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleWin() {
    		throw new Error("<Computer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleWin(value) {
    		throw new Error("<Computer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getPerformance() {
    		throw new Error("<Computer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getPerformance(value) {
    		throw new Error("<Computer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/ConfigList.svelte generated by Svelte v3.46.6 */

    const file$2 = "src/ConfigList.svelte";

    function create_fragment$2(ctx) {
    	let p;
    	let t1;
    	let ul;
    	let li0;
    	let t2;
    	let t3_value = /*config*/ ctx[0].min + "";
    	let t3;
    	let t4;
    	let t5_value = /*config*/ ctx[0].max + "";
    	let t5;
    	let t6;
    	let t7;
    	let li1;
    	let t8;
    	let t9_value = /*config*/ ctx[0].secret + "";
    	let t9;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Config";
    			t1 = space();
    			ul = element("ul");
    			li0 = element("li");
    			t2 = text("Range: [");
    			t3 = text(t3_value);
    			t4 = text(", ");
    			t5 = text(t5_value);
    			t6 = text("]");
    			t7 = space();
    			li1 = element("li");
    			t8 = text("Player's secret: ");
    			t9 = text(t9_value);
    			attr_dev(p, "class", "svelte-e6j7vk");
    			add_location(p, file$2, 4, 0, 39);
    			add_location(li0, file$2, 6, 1, 59);
    			add_location(li1, file$2, 7, 1, 105);
    			add_location(ul, file$2, 5, 0, 53);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li0);
    			append_dev(li0, t2);
    			append_dev(li0, t3);
    			append_dev(li0, t4);
    			append_dev(li0, t5);
    			append_dev(li0, t6);
    			append_dev(ul, t7);
    			append_dev(ul, li1);
    			append_dev(li1, t8);
    			append_dev(li1, t9);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*config*/ 1 && t3_value !== (t3_value = /*config*/ ctx[0].min + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*config*/ 1 && t5_value !== (t5_value = /*config*/ ctx[0].max + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*config*/ 1 && t9_value !== (t9_value = /*config*/ ctx[0].secret + "")) set_data_dev(t9, t9_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(ul);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ConfigList', slots, []);
    	let { config } = $$props;
    	const writable_props = ['config'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ConfigList> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('config' in $$props) $$invalidate(0, config = $$props.config);
    	};

    	$$self.$capture_state = () => ({ config });

    	$$self.$inject_state = $$props => {
    		if ('config' in $$props) $$invalidate(0, config = $$props.config);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [config];
    }

    class ConfigList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { config: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ConfigList",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*config*/ ctx[0] === undefined && !('config' in props)) {
    			console.warn("<ConfigList> was created without expected prop 'config'");
    		}
    	}

    	get config() {
    		throw new Error("<ConfigList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set config(value) {
    		throw new Error("<ConfigList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Score.svelte generated by Svelte v3.46.6 */

    const file$1 = "src/Score.svelte";

    function create_fragment$1(ctx) {
    	let p;
    	let t0;
    	let t1;
    	let t2;
    	let ul;
    	let li0;
    	let t3;
    	let t4_value = /*percents*/ ctx[1]["high"] + "";
    	let t4;
    	let t5;
    	let t6;
    	let li1;
    	let t7;
    	let t8_value = /*percents*/ ctx[1]["medium"] + "";
    	let t8;
    	let t9;
    	let t10;
    	let li2;
    	let t11;
    	let t12_value = /*percents*/ ctx[1]["low"] + "";
    	let t12;
    	let t13;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(/*candidate*/ ctx[0]);
    			t1 = text("'s stats:");
    			t2 = space();
    			ul = element("ul");
    			li0 = element("li");
    			t3 = text("High performance: ~");
    			t4 = text(t4_value);
    			t5 = text("%");
    			t6 = space();
    			li1 = element("li");
    			t7 = text("Medium performance: ~");
    			t8 = text(t8_value);
    			t9 = text("%");
    			t10 = space();
    			li2 = element("li");
    			t11 = text("Low performance: ~");
    			t12 = text(t12_value);
    			t13 = text("%");
    			attr_dev(p, "class", "svelte-e6j7vk");
    			add_location(p, file$1, 17, 0, 336);
    			add_location(li0, file$1, 19, 1, 370);
    			add_location(li1, file$1, 20, 1, 419);
    			add_location(li2, file$1, 21, 1, 472);
    			add_location(ul, file$1, 18, 0, 364);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li0);
    			append_dev(li0, t3);
    			append_dev(li0, t4);
    			append_dev(li0, t5);
    			append_dev(ul, t6);
    			append_dev(ul, li1);
    			append_dev(li1, t7);
    			append_dev(li1, t8);
    			append_dev(li1, t9);
    			append_dev(ul, t10);
    			append_dev(ul, li2);
    			append_dev(li2, t11);
    			append_dev(li2, t12);
    			append_dev(li2, t13);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*candidate*/ 1) set_data_dev(t0, /*candidate*/ ctx[0]);
    			if (dirty & /*percents*/ 2 && t4_value !== (t4_value = /*percents*/ ctx[1]["high"] + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*percents*/ 2 && t8_value !== (t8_value = /*percents*/ ctx[1]["medium"] + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*percents*/ 2 && t12_value !== (t12_value = /*percents*/ ctx[1]["low"] + "")) set_data_dev(t12, t12_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(ul);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let percents;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Score', slots, []);
    	let { data } = $$props;
    	let { candidate } = $$props;
    	let sum;
    	const writable_props = ['data', 'candidate'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Score> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(2, data = $$props.data);
    		if ('candidate' in $$props) $$invalidate(0, candidate = $$props.candidate);
    	};

    	$$self.$capture_state = () => ({ data, candidate, sum, percents });

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(2, data = $$props.data);
    		if ('candidate' in $$props) $$invalidate(0, candidate = $$props.candidate);
    		if ('sum' in $$props) $$invalidate(3, sum = $$props.sum);
    		if ('percents' in $$props) $$invalidate(1, percents = $$props.percents);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*data, sum*/ 12) {
    			{
    				$$invalidate(3, sum = data["high"] + data["medium"] + data["low"]);
    				if (sum == 0) $$invalidate(3, sum = 1); // Avoid division by zero
    			}
    		}

    		if ($$self.$$.dirty & /*data, sum*/ 12) {
    			$$invalidate(1, percents = {
    				high: parseInt(data["high"] / sum * 100),
    				medium: parseInt(data["medium"] / sum * 100),
    				low: parseInt(data["low"] / sum * 100)
    			});
    		}
    	};

    	return [candidate, percents, data, sum];
    }

    class Score extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { data: 2, candidate: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Score",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[2] === undefined && !('data' in props)) {
    			console.warn("<Score> was created without expected prop 'data'");
    		}

    		if (/*candidate*/ ctx[0] === undefined && !('candidate' in props)) {
    			console.warn("<Score> was created without expected prop 'candidate'");
    		}
    	}

    	get data() {
    		throw new Error("<Score>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Score>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get candidate() {
    		throw new Error("<Score>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set candidate(value) {
    		throw new Error("<Score>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.46.6 */
    const file = "src/App.svelte";

    // (90:37) 
    function create_if_block_3(ctx) {
    	let computer;
    	let updating_screen;
    	let current;

    	function computer_screen_binding(value) {
    		/*computer_screen_binding*/ ctx[9](value);
    	}

    	let computer_props = {
    		config: /*config*/ ctx[1],
    		handleWin: /*handleWin*/ ctx[4],
    		getPerformance: /*getPerformance*/ ctx[3]
    	};

    	if (/*screen*/ ctx[0] !== void 0) {
    		computer_props.screen = /*screen*/ ctx[0];
    	}

    	computer = new Computer({ props: computer_props, $$inline: true });
    	binding_callbacks.push(() => bind(computer, 'screen', computer_screen_binding));

    	const block = {
    		c: function create() {
    			create_component(computer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(computer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const computer_changes = {};
    			if (dirty & /*config*/ 2) computer_changes.config = /*config*/ ctx[1];

    			if (!updating_screen && dirty & /*screen*/ 1) {
    				updating_screen = true;
    				computer_changes.screen = /*screen*/ ctx[0];
    				add_flush_callback(() => updating_screen = false);
    			}

    			computer.$set(computer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(computer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(computer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(computer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(90:37) ",
    		ctx
    	});

    	return block;
    }

    // (82:35) 
    function create_if_block_2(ctx) {
    	let player;
    	let updating_screen;
    	let current;

    	function player_screen_binding(value) {
    		/*player_screen_binding*/ ctx[8](value);
    	}

    	let player_props = {
    		config: /*config*/ ctx[1],
    		handleWin: /*handleWin*/ ctx[4],
    		getPerformance: /*getPerformance*/ ctx[3]
    	};

    	if (/*screen*/ ctx[0] !== void 0) {
    		player_props.screen = /*screen*/ ctx[0];
    	}

    	player = new Player({ props: player_props, $$inline: true });
    	binding_callbacks.push(() => bind(player, 'screen', player_screen_binding));

    	const block = {
    		c: function create() {
    			create_component(player.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(player, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const player_changes = {};
    			if (dirty & /*config*/ 2) player_changes.config = /*config*/ ctx[1];

    			if (!updating_screen && dirty & /*screen*/ 1) {
    				updating_screen = true;
    				player_changes.screen = /*screen*/ ctx[0];
    				add_flush_callback(() => updating_screen = false);
    			}

    			player.$set(player_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(player.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(player.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(player, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(82:35) ",
    		ctx
    	});

    	return block;
    }

    // (75:29) 
    function create_if_block_1(ctx) {
    	let config_1;
    	let updating_screen;
    	let current;

    	function config_1_screen_binding(value) {
    		/*config_1_screen_binding*/ ctx[7](value);
    	}

    	let config_1_props = {
    		config: /*config*/ ctx[1],
    		updateConfig: /*updateConfig*/ ctx[5]
    	};

    	if (/*screen*/ ctx[0] !== void 0) {
    		config_1_props.screen = /*screen*/ ctx[0];
    	}

    	config_1 = new Config({ props: config_1_props, $$inline: true });
    	binding_callbacks.push(() => bind(config_1, 'screen', config_1_screen_binding));

    	const block = {
    		c: function create() {
    			create_component(config_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(config_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const config_1_changes = {};
    			if (dirty & /*config*/ 2) config_1_changes.config = /*config*/ ctx[1];

    			if (!updating_screen && dirty & /*screen*/ 1) {
    				updating_screen = true;
    				config_1_changes.screen = /*screen*/ ctx[0];
    				add_flush_callback(() => updating_screen = false);
    			}

    			config_1.$set(config_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(config_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(config_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(config_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(75:29) ",
    		ctx
    	});

    	return block;
    }

    // (72:0) {#if screen == "Main Menu"}
    function create_if_block(ctx) {
    	let mainmenu;
    	let updating_screen;
    	let current;

    	function mainmenu_screen_binding(value) {
    		/*mainmenu_screen_binding*/ ctx[6](value);
    	}

    	let mainmenu_props = {};

    	if (/*screen*/ ctx[0] !== void 0) {
    		mainmenu_props.screen = /*screen*/ ctx[0];
    	}

    	mainmenu = new MainMenu({ props: mainmenu_props, $$inline: true });
    	binding_callbacks.push(() => bind(mainmenu, 'screen', mainmenu_screen_binding));

    	const block = {
    		c: function create() {
    			create_component(mainmenu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(mainmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const mainmenu_changes = {};

    			if (!updating_screen && dirty & /*screen*/ 1) {
    				updating_screen = true;
    				mainmenu_changes.screen = /*screen*/ ctx[0];
    				add_flush_callback(() => updating_screen = false);
    			}

    			mainmenu.$set(mainmenu_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mainmenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mainmenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mainmenu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(72:0) {#if screen == \\\"Main Menu\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let h3;
    	let t0;
    	let t1;
    	let t2;
    	let hr0;
    	let t3;
    	let current_block_type_index;
    	let if_block;
    	let t4;
    	let hr1;
    	let t5;
    	let configlist;
    	let t6;
    	let score0;
    	let t7;
    	let score1;
    	let t8;
    	let hr2;
    	let t9;
    	let p;
    	let current;
    	const if_block_creators = [create_if_block, create_if_block_1, create_if_block_2, create_if_block_3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*screen*/ ctx[0] == "Main Menu") return 0;
    		if (/*screen*/ ctx[0] == "Config") return 1;
    		if (/*screen*/ ctx[0] == "Player Guess") return 2;
    		if (/*screen*/ ctx[0] == "Computer Guess") return 3;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	configlist = new ConfigList({
    			props: { config: /*config*/ ctx[1] },
    			$$inline: true
    		});

    	score0 = new Score({
    			props: {
    				candidate: "Player",
    				data: /*score*/ ctx[2].player
    			},
    			$$inline: true
    		});

    	score1 = new Score({
    			props: {
    				candidate: "Computer",
    				data: /*score*/ ctx[2].computer
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text("Number Guesser: ");
    			t1 = text(/*screen*/ ctx[0]);
    			t2 = space();
    			hr0 = element("hr");
    			t3 = space();
    			if (if_block) if_block.c();
    			t4 = space();
    			hr1 = element("hr");
    			t5 = space();
    			create_component(configlist.$$.fragment);
    			t6 = space();
    			create_component(score0.$$.fragment);
    			t7 = space();
    			create_component(score1.$$.fragment);
    			t8 = space();
    			hr2 = element("hr");
    			t9 = space();
    			p = element("p");
    			p.textContent = "by Michael Skyba";
    			add_location(h3, file, 68, 0, 1311);
    			add_location(hr0, file, 69, 0, 1345);
    			add_location(hr1, file, 99, 0, 1755);
    			add_location(hr2, file, 104, 0, 1887);
    			add_location(p, file, 105, 0, 1892);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			append_dev(h3, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, hr0, anchor);
    			insert_dev(target, t3, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, t4, anchor);
    			insert_dev(target, hr1, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(configlist, target, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(score0, target, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(score1, target, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, hr2, anchor);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, p, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*screen*/ 1) set_data_dev(t1, /*screen*/ ctx[0]);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(t4.parentNode, t4);
    				} else {
    					if_block = null;
    				}
    			}

    			const configlist_changes = {};
    			if (dirty & /*config*/ 2) configlist_changes.config = /*config*/ ctx[1];
    			configlist.$set(configlist_changes);
    			const score0_changes = {};
    			if (dirty & /*score*/ 4) score0_changes.data = /*score*/ ctx[2].player;
    			score0.$set(score0_changes);
    			const score1_changes = {};
    			if (dirty & /*score*/ 4) score1_changes.data = /*score*/ ctx[2].computer;
    			score1.$set(score1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(configlist.$$.fragment, local);
    			transition_in(score0.$$.fragment, local);
    			transition_in(score1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(configlist.$$.fragment, local);
    			transition_out(score0.$$.fragment, local);
    			transition_out(score1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(hr0);
    			if (detaching) detach_dev(t3);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(hr1);
    			if (detaching) detach_dev(t5);
    			destroy_component(configlist, detaching);
    			if (detaching) detach_dev(t6);
    			destroy_component(score0, detaching);
    			if (detaching) detach_dev(t7);
    			destroy_component(score1, detaching);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(hr2);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let screen = "Main Menu";
    	let config = { min: 1, max: 100, secret: 68 };

    	let score = {
    		player: { high: 0, medium: 0, low: 0 },
    		computer: { high: 0, medium: 0, low: 0 }
    	};

    	const getPerformance = guesses => {
    		let range = config.max - config.min + 1;
    		let medium = Math.floor(Math.log(range) / Math.log(2)) + 1;
    		if (guesses == medium) performance = "medium"; else if (guesses < medium) performance = "high"; else performance = "low";
    		return performance;
    	};

    	const handleWin = (candidate, performance) => {
    		$$invalidate(2, score[candidate][performance]++, score);
    	};

    	const changeScreen = updated => {
    		$$invalidate(0, screen = updated);
    	};

    	const updateConfig = updated => {
    		let min = parseInt(updated.min);
    		let max = parseInt(updated.max);
    		let secret = parseInt(updated.secret);
    		let valid = true;
    		if (isNaN(min) || isNaN(max) || isNaN(secret)) valid = false;
    		if (valid && min >= max) valid = false;
    		if (valid && (secret < min || secret > max)) valid = false;
    		if (valid) $$invalidate(1, config = { min, max, secret });
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function mainmenu_screen_binding(value) {
    		screen = value;
    		$$invalidate(0, screen);
    	}

    	function config_1_screen_binding(value) {
    		screen = value;
    		$$invalidate(0, screen);
    	}

    	function player_screen_binding(value) {
    		screen = value;
    		$$invalidate(0, screen);
    	}

    	function computer_screen_binding(value) {
    		screen = value;
    		$$invalidate(0, screen);
    	}

    	$$self.$capture_state = () => ({
    		MainMenu,
    		Config,
    		Player,
    		Computer,
    		ConfigList,
    		Score,
    		screen,
    		config,
    		score,
    		getPerformance,
    		handleWin,
    		changeScreen,
    		updateConfig
    	});

    	$$self.$inject_state = $$props => {
    		if ('screen' in $$props) $$invalidate(0, screen = $$props.screen);
    		if ('config' in $$props) $$invalidate(1, config = $$props.config);
    		if ('score' in $$props) $$invalidate(2, score = $$props.score);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		screen,
    		config,
    		score,
    		getPerformance,
    		handleWin,
    		updateConfig,
    		mainmenu_screen_binding,
    		config_1_screen_binding,
    		player_screen_binding,
    		computer_screen_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
