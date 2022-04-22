
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
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
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

    /* src/Menu.svelte generated by Svelte v3.46.4 */

    const file$3 = "src/Menu.svelte";

    function create_fragment$3(ctx) {
    	let input0;
    	let t;
    	let input1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input0 = element("input");
    			t = space();
    			input1 = element("input");
    			attr_dev(input0, "type", "button");
    			input0.value = "Dice";
    			attr_dev(input0, "class", "svelte-1ngfnx");
    			add_location(input0, file$3, 4, 0, 45);
    			attr_dev(input1, "type", "button");
    			input1.value = "Settings";
    			attr_dev(input1, "class", "svelte-1ngfnx");
    			add_location(input1, file$3, 5, 0, 112);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, input1, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						input0,
    						"click",
    						function () {
    							if (is_function(/*selectScreen*/ ctx[0]("Dice"))) /*selectScreen*/ ctx[0]("Dice").apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						input1,
    						"click",
    						function () {
    							if (is_function(/*selectScreen*/ ctx[0]("Settings"))) /*selectScreen*/ ctx[0]("Settings").apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(input1);
    			mounted = false;
    			run_all(dispose);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Menu', slots, []);
    	let { selectScreen } = $$props;
    	const writable_props = ['selectScreen'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('selectScreen' in $$props) $$invalidate(0, selectScreen = $$props.selectScreen);
    	};

    	$$self.$capture_state = () => ({ selectScreen });

    	$$self.$inject_state = $$props => {
    		if ('selectScreen' in $$props) $$invalidate(0, selectScreen = $$props.selectScreen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selectScreen];
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { selectScreen: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*selectScreen*/ ctx[0] === undefined && !('selectScreen' in props)) {
    			console.warn("<Menu> was created without expected prop 'selectScreen'");
    		}
    	}

    	get selectScreen() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectScreen(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Dice.svelte generated by Svelte v3.46.4 */

    const file$2 = "src/Dice.svelte";

    // (15:0) {#if style == "Red"}
    function create_if_block_2$1(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "/r" + (/*side*/ ctx[2] + 1) + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = "Red die showing " + (/*side*/ ctx[2] + 1));
    			add_location(img, file$2, 15, 0, 209);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*side*/ 4 && !src_url_equal(img.src, img_src_value = "/r" + (/*side*/ ctx[2] + 1) + ".png")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*side*/ 4 && img_alt_value !== (img_alt_value = "Red die showing " + (/*side*/ ctx[2] + 1))) {
    				attr_dev(img, "alt", img_alt_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(15:0) {#if style == \\\"Red\\\"}",
    		ctx
    	});

    	return block;
    }

    // (19:0) {#if style == "Black"}
    function create_if_block_1$1(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "/b" + (/*side*/ ctx[2] + 1) + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = "Black die showing " + (/*side*/ ctx[2] + 1));
    			add_location(img, file$2, 19, 0, 297);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*side*/ 4 && !src_url_equal(img.src, img_src_value = "/b" + (/*side*/ ctx[2] + 1) + ".png")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*side*/ 4 && img_alt_value !== (img_alt_value = "Black die showing " + (/*side*/ ctx[2] + 1))) {
    				attr_dev(img, "alt", img_alt_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(19:0) {#if style == \\\"Black\\\"}",
    		ctx
    	});

    	return block;
    }

    // (23:0) {#if style == "Numbers"}
    function create_if_block$2(ctx) {
    	let p;
    	let t_value = /*side*/ ctx[2] + 1 + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "svelte-1a6msas");
    			add_location(p, file$2, 23, 0, 389);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*side*/ 4 && t_value !== (t_value = /*side*/ ctx[2] + 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(23:0) {#if style == \\\"Numbers\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let br;
    	let t3;
    	let input0;
    	let t4;
    	let input1;
    	let mounted;
    	let dispose;
    	let if_block0 = /*style*/ ctx[1] == "Red" && create_if_block_2$1(ctx);
    	let if_block1 = /*style*/ ctx[1] == "Black" && create_if_block_1$1(ctx);
    	let if_block2 = /*style*/ ctx[1] == "Numbers" && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			br = element("br");
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			input1 = element("input");
    			add_location(br, file$2, 26, 0, 412);
    			attr_dev(input0, "type", "button");
    			input0.value = "Roll";
    			add_location(input0, file$2, 27, 0, 417);
    			attr_dev(input1, "type", "button");
    			input1.value = "Back";
    			add_location(input1, file$2, 28, 0, 468);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, br, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, input0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, input1, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "click", /*roll*/ ctx[3], false, false, false),
    					listen_dev(
    						input1,
    						"click",
    						function () {
    							if (is_function(/*back*/ ctx[0])) /*back*/ ctx[0].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (/*style*/ ctx[1] == "Red") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*style*/ ctx[1] == "Black") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*style*/ ctx[1] == "Numbers") {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$2(ctx);
    					if_block2.c();
    					if_block2.m(t2.parentNode, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(input1);
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots('Dice', slots, []);
    	let { back } = $$props;
    	let { style } = $$props;
    	let { max } = $$props;
    	if (style != "Numbers") max = 6;

    	function roll() {
    		$$invalidate(2, side = Math.round(Math.random() * (max - 1)));
    	}

    	let side = 0;
    	const writable_props = ['back', 'style', 'max'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dice> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('back' in $$props) $$invalidate(0, back = $$props.back);
    		if ('style' in $$props) $$invalidate(1, style = $$props.style);
    		if ('max' in $$props) $$invalidate(4, max = $$props.max);
    	};

    	$$self.$capture_state = () => ({ back, style, max, roll, side });

    	$$self.$inject_state = $$props => {
    		if ('back' in $$props) $$invalidate(0, back = $$props.back);
    		if ('style' in $$props) $$invalidate(1, style = $$props.style);
    		if ('max' in $$props) $$invalidate(4, max = $$props.max);
    		if ('side' in $$props) $$invalidate(2, side = $$props.side);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [back, style, side, roll, max];
    }

    class Dice extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { back: 0, style: 1, max: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dice",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*back*/ ctx[0] === undefined && !('back' in props)) {
    			console.warn("<Dice> was created without expected prop 'back'");
    		}

    		if (/*style*/ ctx[1] === undefined && !('style' in props)) {
    			console.warn("<Dice> was created without expected prop 'style'");
    		}

    		if (/*max*/ ctx[4] === undefined && !('max' in props)) {
    			console.warn("<Dice> was created without expected prop 'max'");
    		}
    	}

    	get back() {
    		throw new Error("<Dice>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set back(value) {
    		throw new Error("<Dice>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Dice>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Dice>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<Dice>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<Dice>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Settings.svelte generated by Svelte v3.46.4 */

    const file$1 = "src/Settings.svelte";

    // (20:0) {#if style == "Numbers"}
    function create_if_block$1(ctx) {
    	let label;
    	let t1;
    	let input;
    	let t2;
    	let p;
    	let t3;
    	let br;
    	let t4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Maximum roll";
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			p = element("p");
    			t3 = text("1000 > x > 0");
    			br = element("br");
    			t4 = text("x ∈ Z");
    			attr_dev(label, "for", "max");
    			attr_dev(label, "class", "svelte-1tf535l");
    			add_location(label, file$1, 20, 1, 495);
    			attr_dev(input, "type", "number");
    			input.value = /*max*/ ctx[3];
    			add_location(input, file$1, 21, 1, 534);
    			add_location(br, file$1, 22, 16, 628);
    			attr_dev(p, "class", "svelte-1tf535l");
    			add_location(p, file$1, 22, 1, 613);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t3);
    			append_dev(p, br);
    			append_dev(p, t4);

    			if (!mounted) {
    				dispose = listen_dev(
    					input,
    					"input",
    					function () {
    						if (is_function(/*updateSetting*/ ctx[1]("max", this.value))) /*updateSetting*/ ctx[1]("max", this.value).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*max*/ 8 && input.value !== /*max*/ ctx[3]) {
    				prop_dev(input, "value", /*max*/ ctx[3]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(20:0) {#if style == \\\"Numbers\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let label;
    	let t1;
    	let select;
    	let option0;
    	let t2_value = /*styles*/ ctx[4][0] + "";
    	let t2;
    	let option0_value_value;
    	let option1;
    	let t3_value = /*styles*/ ctx[4][1] + "";
    	let t3;
    	let option1_value_value;
    	let option2;
    	let t4_value = /*styles*/ ctx[4][2] + "";
    	let t4;
    	let option2_value_value;
    	let t5;
    	let br;
    	let t6;
    	let t7;
    	let input;
    	let mounted;
    	let dispose;
    	let if_block = /*style*/ ctx[2] == "Numbers" && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Style";
    			t1 = space();
    			select = element("select");
    			option0 = element("option");
    			t2 = text(t2_value);
    			option1 = element("option");
    			t3 = text(t3_value);
    			option2 = element("option");
    			t4 = text(t4_value);
    			t5 = space();
    			br = element("br");
    			t6 = space();
    			if (if_block) if_block.c();
    			t7 = space();
    			input = element("input");
    			attr_dev(label, "for", "style");
    			attr_dev(label, "class", "svelte-1tf535l");
    			add_location(label, file$1, 11, 0, 201);
    			option0.__value = option0_value_value = /*styles*/ ctx[4][0];
    			option0.value = option0.__value;
    			option0.selected = true;
    			add_location(option0, file$1, 13, 1, 301);
    			option1.__value = option1_value_value = /*styles*/ ctx[4][1];
    			option1.value = option1.__value;
    			add_location(option1, file$1, 14, 1, 358);
    			option2.__value = option2_value_value = /*styles*/ ctx[4][2];
    			option2.value = option2.__value;
    			add_location(option2, file$1, 15, 1, 406);
    			attr_dev(select, "id", "style");
    			attr_dev(select, "class", "svelte-1tf535l");
    			add_location(select, file$1, 12, 0, 234);
    			add_location(br, file$1, 17, 0, 463);
    			attr_dev(input, "type", "button");
    			input.value = "Back";
    			add_location(input, file$1, 25, 0, 649);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, select, anchor);
    			append_dev(select, option0);
    			append_dev(option0, t2);
    			append_dev(select, option1);
    			append_dev(option1, t3);
    			append_dev(select, option2);
    			append_dev(option2, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, br, anchor);
    			insert_dev(target, t6, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						select,
    						"input",
    						function () {
    							if (is_function(/*updateSetting*/ ctx[1]("style", this.value))) /*updateSetting*/ ctx[1]("style", this.value).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						input,
    						"click",
    						function () {
    							if (is_function(/*back*/ ctx[0])) /*back*/ ctx[0].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (dirty & /*styles*/ 16 && t2_value !== (t2_value = /*styles*/ ctx[4][0] + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*styles*/ 16 && option0_value_value !== (option0_value_value = /*styles*/ ctx[4][0])) {
    				prop_dev(option0, "__value", option0_value_value);
    				option0.value = option0.__value;
    			}

    			if (dirty & /*styles*/ 16 && t3_value !== (t3_value = /*styles*/ ctx[4][1] + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*styles*/ 16 && option1_value_value !== (option1_value_value = /*styles*/ ctx[4][1])) {
    				prop_dev(option1, "__value", option1_value_value);
    				option1.value = option1.__value;
    			}

    			if (dirty & /*styles*/ 16 && t4_value !== (t4_value = /*styles*/ ctx[4][2] + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*styles*/ 16 && option2_value_value !== (option2_value_value = /*styles*/ ctx[4][2])) {
    				prop_dev(option2, "__value", option2_value_value);
    				option2.value = option2.__value;
    			}

    			if (/*style*/ ctx[2] == "Numbers") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(t7.parentNode, t7);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(select);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t6);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Settings', slots, []);
    	let { back } = $$props;
    	let { updateSetting } = $$props;
    	let { style } = $$props;
    	let { max } = $$props;
    	let styles = [style, "Black", "Numbers"];
    	styles[["Red", "Black", "Numbers"].indexOf(style)] = "Red";
    	const writable_props = ['back', 'updateSetting', 'style', 'max'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Settings> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('back' in $$props) $$invalidate(0, back = $$props.back);
    		if ('updateSetting' in $$props) $$invalidate(1, updateSetting = $$props.updateSetting);
    		if ('style' in $$props) $$invalidate(2, style = $$props.style);
    		if ('max' in $$props) $$invalidate(3, max = $$props.max);
    	};

    	$$self.$capture_state = () => ({ back, updateSetting, style, max, styles });

    	$$self.$inject_state = $$props => {
    		if ('back' in $$props) $$invalidate(0, back = $$props.back);
    		if ('updateSetting' in $$props) $$invalidate(1, updateSetting = $$props.updateSetting);
    		if ('style' in $$props) $$invalidate(2, style = $$props.style);
    		if ('max' in $$props) $$invalidate(3, max = $$props.max);
    		if ('styles' in $$props) $$invalidate(4, styles = $$props.styles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [back, updateSetting, style, max, styles];
    }

    class Settings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			back: 0,
    			updateSetting: 1,
    			style: 2,
    			max: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Settings",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*back*/ ctx[0] === undefined && !('back' in props)) {
    			console.warn("<Settings> was created without expected prop 'back'");
    		}

    		if (/*updateSetting*/ ctx[1] === undefined && !('updateSetting' in props)) {
    			console.warn("<Settings> was created without expected prop 'updateSetting'");
    		}

    		if (/*style*/ ctx[2] === undefined && !('style' in props)) {
    			console.warn("<Settings> was created without expected prop 'style'");
    		}

    		if (/*max*/ ctx[3] === undefined && !('max' in props)) {
    			console.warn("<Settings> was created without expected prop 'max'");
    		}
    	}

    	get back() {
    		throw new Error("<Settings>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set back(value) {
    		throw new Error("<Settings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get updateSetting() {
    		throw new Error("<Settings>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set updateSetting(value) {
    		throw new Error("<Settings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Settings>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Settings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<Settings>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<Settings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.46.4 */
    const file = "src/App.svelte";

    // (31:0) {#if screen == "Main menu"}
    function create_if_block_2(ctx) {
    	let menu;
    	let current;

    	menu = new Menu({
    			props: { selectScreen: /*selectScreen*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(menu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(menu, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(31:0) {#if screen == \\\"Main menu\\\"}",
    		ctx
    	});

    	return block;
    }

    // (35:0) {#if screen == "Dice"}
    function create_if_block_1(ctx) {
    	let dice;
    	let current;

    	dice = new Dice({
    			props: {
    				back: /*back*/ ctx[4],
    				style: /*style*/ ctx[1],
    				max: /*max*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dice.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dice, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dice_changes = {};
    			if (dirty & /*style*/ 2) dice_changes.style = /*style*/ ctx[1];
    			if (dirty & /*max*/ 4) dice_changes.max = /*max*/ ctx[2];
    			dice.$set(dice_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dice.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dice.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dice, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(35:0) {#if screen == \\\"Dice\\\"}",
    		ctx
    	});

    	return block;
    }

    // (39:0) {#if screen == "Settings"}
    function create_if_block(ctx) {
    	let settings;
    	let current;

    	settings = new Settings({
    			props: {
    				back: /*back*/ ctx[4],
    				updateSetting: /*updateSetting*/ ctx[5],
    				style: /*style*/ ctx[1],
    				max: /*max*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(settings.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(settings, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const settings_changes = {};
    			if (dirty & /*style*/ 2) settings_changes.style = /*style*/ ctx[1];
    			if (dirty & /*max*/ 4) settings_changes.max = /*max*/ ctx[2];
    			settings.$set(settings_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(settings.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(settings.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(settings, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(39:0) {#if screen == \\\"Settings\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let h1;
    	let t0;
    	let t1;
    	let t2;
    	let hr0;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let hr1;
    	let t7;
    	let p;
    	let current;
    	let if_block0 = /*screen*/ ctx[0] == "Main menu" && create_if_block_2(ctx);
    	let if_block1 = /*screen*/ ctx[0] == "Dice" && create_if_block_1(ctx);
    	let if_block2 = /*screen*/ ctx[0] == "Settings" && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text("Dice game: ");
    			t1 = text(/*screen*/ ctx[0]);
    			t2 = space();
    			hr0 = element("hr");
    			t3 = space();
    			if (if_block0) if_block0.c();
    			t4 = space();
    			if (if_block1) if_block1.c();
    			t5 = space();
    			if (if_block2) if_block2.c();
    			t6 = space();
    			hr1 = element("hr");
    			t7 = space();
    			p = element("p");
    			p.textContent = "by Michael Skyba";
    			add_location(h1, file, 27, 0, 476);
    			add_location(hr0, file, 28, 0, 505);
    			add_location(hr1, file, 42, 0, 718);
    			add_location(p, file, 43, 0, 723);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, hr0, anchor);
    			insert_dev(target, t3, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t4, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t5, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, hr1, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, p, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*screen*/ 1) set_data_dev(t1, /*screen*/ ctx[0]);

    			if (/*screen*/ ctx[0] == "Main menu") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*screen*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t4.parentNode, t4);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*screen*/ ctx[0] == "Dice") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*screen*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t5.parentNode, t5);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*screen*/ ctx[0] == "Settings") {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*screen*/ 1) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(t6.parentNode, t6);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(hr0);
    			if (detaching) detach_dev(t3);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t4);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t5);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(hr1);
    			if (detaching) detach_dev(t7);
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
    	let screen = "Main menu";
    	let style = "Black";
    	let max = 6;

    	function selectScreen(updated) {
    		$$invalidate(0, screen = updated);
    	}

    	function back() {
    		$$invalidate(0, screen = "Main menu");
    	}

    	function updateSetting(setting, value) {
    		if (setting == "max") {
    			let num = parseInt(value);
    			if (!isNaN(num) && num > 0 && num < 1000) $$invalidate(2, max = num);
    		} else $$invalidate(1, style = value);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Menu,
    		Dice,
    		Settings,
    		screen,
    		style,
    		max,
    		selectScreen,
    		back,
    		updateSetting
    	});

    	$$self.$inject_state = $$props => {
    		if ('screen' in $$props) $$invalidate(0, screen = $$props.screen);
    		if ('style' in $$props) $$invalidate(1, style = $$props.style);
    		if ('max' in $$props) $$invalidate(2, max = $$props.max);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [screen, style, max, selectScreen, back, updateSetting];
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

    var app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
