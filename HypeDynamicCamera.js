/*!
Hype Dynamic Camera 1.2.4
copyright (c) 2015 by Lucky (Tumult Forum @Luckyde)
maintaind since 2018 by Max Ziebell, (https://maxziebell.de). MIT-license
*/

/*
* Version-History
* 1.0.0 Original version by Luckyde
* 1.1.0 Tweaked requestAnimationframe, sceneElm scope
* 1.2.0	Github release under MIT-license, refactored to HypeDynamicCamera
* 1.2.1 Refactored to use a Mutation Observer instead of requestAnimationFrame
* 1.2.2 Fixed inital update regression after switching to Mutation Observer
* 1.2.3 Moved the automatic application of the observer to HypeScenePrepareForDisplay
* 1.2.4 Added border style for IDE, HypeDynamicCamera.hideBorderInIDE, .dynamic-camera-no-border and --dynamic-camera-border
*/
if("HypeDynamicCamera" in window === false) window['HypeDynamicCamera'] = (function () {

	// camera observer lookup
	var _cameraObserverLookup = {};
	var _installedCSS =  false;
	var _hideBorderInIDE = false;

	/* @const */
	const _isHypeIDE = window.location.href.indexOf("/Hype/Scratch/HypeScratch.") != -1;

	/* Install CSS needed for this extension */
	if (_isHypeIDE && !_installedCSS) {
		// delay a frame
		requestAnimationFrame(function(){
			if (_hideBorderInIDE) return;
			_installedCSS = true;
			var s=document.createElement("style");
			s.setAttribute("type","text/css");
			s.appendChild(document.createTextNode('[data-dynamic-camera]:not(.dynamic-camera-no-border) { box-sizing: border-box !important; border: var(--dynamic-camera-border, solid red 4px) !important;}'));
			document.getElementsByTagName("head")[0].appendChild(s);
		})
	}
	
	function HypeDocumentLoad (hypeDocument, element, event) {
		
		hypeDocument.setupDynamicCamera =  function(cameraElm, stageElm, options) {
			
			// default options to object
			options = options || {};
			
			// restart observer if already created
			if (_cameraObserverLookup[cameraElm.id]) {
				_cameraObserverLookup[cameraElm.id].observe(cameraElm, {
					attributes: true,
					attributeFilter: [ "style"],
				});

				// fire observer once manually
				cameraElm.setAttribute('style', cameraElm.getAttribute('style'));
				return;
			}

			// make sure we have a stageElm and cameraElm
			var sceneElm = document.getElementById(hypeDocument.currentSceneId());
			if (cameraElm && typeof cameraElm == 'string') cameraElm = sceneElm.querySelector(cameraElm);
			if (stageElm && typeof stageElm == 'string') stageElm = sceneElm.querySelector(stageElm);
			stageElm = stageElm || sceneElm;
			if (!(stageElm && cameraElm)) return;

			// setup variables
			var DEG = 180 / Math.PI;
			var camMatrix, scaleW, scaleH, originX, originY, translateX, translateY, angle, 
				camL, camT, camH, camW, camsX, camsY, realW, realH, realL, realT, stageW, stageH;

			// hide camera by default
			if (!options.showCamera) {
				cameraElm.style.visibility = 'hidden';
				cameraElm.style.zIndex = sceneElm.style.zIndex;
			}

			function cameraObserver(mutationList) {
			
				// fetch current cameraElm transforms
				camMatrix = new WebKitCSSMatrix(window.getComputedStyle(cameraElm).webkitTransform)
				stageW = hypeDocument.getElementProperty(sceneElm, 'width');
				stageH = hypeDocument.getElementProperty(sceneElm, 'height');
				camL = hypeDocument.getElementProperty(cameraElm, 'left');
				camT = hypeDocument.getElementProperty(cameraElm, 'top');
				camH = hypeDocument.getElementProperty(cameraElm, 'height');
				camW = hypeDocument.getElementProperty(cameraElm, 'width');
				camsX = hypeDocument.getElementProperty(cameraElm, 'scaleX');
				camsY = hypeDocument.getElementProperty(cameraElm, 'scaleY');

				// calc missing values 
				angle = -Math.atan2(camMatrix.b, camMatrix.a) * DEG;
				realW = camW * camsX;
				realH = camH * camsY;
				realL = (camL - (realW - camW) / 2);
				realT = (camT - (realH - camH) / 2);
				originX = (realL + (realW / 2));
				originY = (realT + (realH / 2));
				translateX = (originX - (stageW / 2)) * -1;
				translateY = (originY - (stageH / 2)) * -1;
				scaleW = stageW / realW;
				scaleH = stageH / realH;

				// apply transformation to stageElm to match camera
				stageElm.style.transformOrigin = stageElm.style.WebkitTransformOrigin = originX + "px " + originY + "px";
				stageElm.style.webkitTransform = stageElm.style.transform = "translateX(" + translateX + "px) translateY(" + translateY + "px) scaleX(" + scaleW + ") scaleY(" + scaleH + ") rotateZ(" + (angle) + "deg)";
				stageElm.style.webkitFilter = cameraElm.style.webkitFilter;
				stageElm.style.opacity = cameraElm.style.opacity;
				stageElm.style.display = cameraElm.style.display;	
			}

			// create and start observer
			_cameraObserverLookup[cameraElm.id] = new MutationObserver(cameraObserver);
			_cameraObserverLookup[cameraElm.id].observe(cameraElm, {
				attributes: true,
				attributeFilter: [ "style"],
			});

			// fire observer once manually
			cameraElm.setAttribute('style', cameraElm.getAttribute('style'));
		}

	}

	function HypeSceneUnload (hypeDocument, element, event) {
		// stop all camera observer when leaving scene
		Object.values(_cameraObserverLookup).forEach(function(observer) {
			observer.disconnect();
		});
	}
	
	function HypeScenePrepareForDisplay (hypeDocument, element, event) {
		var sceneElm = document.getElementById(hypeDocument.currentSceneId());
		sceneElm.querySelectorAll('[data-dynamic-camera]').forEach(function(elm){
			var stageSelector = elm.getAttribute('data-dynamic-camera');
			hypeDocument.setupDynamicCamera(elm, stageSelector);
		});
	}

	/* setup callbacks */
	if("HYPE_eventListeners" in window === false) { window.HYPE_eventListeners = Array();}
	window.HYPE_eventListeners.push({"type":"HypeDocumentLoad", "callback": HypeDocumentLoad});
	window.HYPE_eventListeners.push({"type":"HypeScenePrepareForDisplay", "callback": HypeScenePrepareForDisplay});
	window.HYPE_eventListeners.push({"type":"HypeSceneUnload", "callback": HypeSceneUnload});
	
	/**
	 * @typedef {Object} HypeDynamicCamera
	 * @property {String} version Version of the extension
	 */
	 var HypeDynamicCamera = {
		version: '1.2.4',
		hideBorderInIDE: function(){
			_hideBorderInIDE = true;
		}
	};

	/** 
	 * Reveal Public interface to window['HypeDynamicCamera']
	 * return {HypeDynamicCamera}
	 */
	return HypeDynamicCamera;
	
})();
