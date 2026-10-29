package com.touhidgit.pocketmogul;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/** Shows the HTML game (the /game folder, packed into the APK's assets) in a full-screen WebView. */
public class MainActivity extends Activity {

    /** Request code of the system file picker opened for an <input type="file"> in the game. */
    private static final int REQUEST_PICK_FILE = 4201;

    private WebView webView;

    /** The page's open file request. It must get exactly one answer: the chosen file(s) or null. */
    private ValueCallback<Uri[]> fileCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        webView.setBackgroundColor(Color.parseColor("#F1F3F8"));
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        webView.setVerticalScrollBarEnabled(false);
        webView.setHorizontalScrollBarEnabled(false);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setTextZoom(100);

        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient() {
            // A WebView ignores <input type="file"> (the profile picture upload) unless the app opens a picker.
            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> filePathCallback,
                                             WebChromeClient.FileChooserParams fileChooserParams) {
                return openFilePicker(filePathCallback, fileChooserParams);
            }
        });
        webView.addJavascriptInterface(new SaveBridge(getSharedPreferences("pocket_mogul", MODE_PRIVATE)), "AndroidBridge");

        setContentView(webView);
        webView.loadUrl("file:///android_asset/index.html");
    }

    /**
     * Opens the system file / photo picker. Always returns true: the callback is answered either
     * here (null = cancelled) or in onActivityResult. No storage permission is needed, because the
     * picker hands back a content:// URI that the WebView reads by itself.
     */
    private boolean openFilePicker(ValueCallback<Uri[]> callback, WebChromeClient.FileChooserParams params) {
        if (fileCallback != null) {
            // An earlier request never got an answer: cancel it so the page isn't left waiting.
            fileCallback.onReceiveValue(null);
            fileCallback = null;
        }

        Intent intent = null;
        if (params != null) {
            try {
                intent = params.createIntent();
            } catch (RuntimeException e) {
                intent = null;
            }
        }
        if (intent == null) {
            intent = imagePickerIntent();
        }

        fileCallback = callback;
        if (startPicker(intent) || startPicker(imagePickerIntent())) {
            return true;
        }

        // No app on this phone can pick a file: tell the page the request was cancelled.
        fileCallback = null;
        callback.onReceiveValue(null);
        return true;
    }

    /** Fallback picker: any app that can open an image (gallery, files, photo picker). */
    private static Intent imagePickerIntent() {
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("image/*");
        return intent;
    }

    private boolean startPicker(Intent intent) {
        try {
            startActivityForResult(intent, REQUEST_PICK_FILE);
            return true;
        } catch (ActivityNotFoundException e) {
            return false;
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode != REQUEST_PICK_FILE) {
            super.onActivityResult(requestCode, resultCode, data);
            return;
        }
        ValueCallback<Uri[]> callback = fileCallback;
        fileCallback = null;
        if (callback != null) {
            // null when the player backed out of the picker
            callback.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(resultCode, data));
        }
    }

    @Override
    protected void onPause() {
        webView.evaluateJavascript("window.saveGame && window.saveGame();", null);
        webView.onPause();
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        webView.onResume();
    }

    @Override
    protected void onDestroy() {
        webView.destroy();
        super.onDestroy();
    }

    /** Let the game close pop-ups / switch tabs first; only leave the app if it didn't. */
    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        webView.evaluateJavascript("window.handleBack ? window.handleBack() : false", value -> {
            if (!"true".equals(value)) finish();
        });
    }

    /** Keeps a second copy of the save in the app's private storage. */
    static class SaveBridge {
        private final SharedPreferences prefs;

        SaveBridge(SharedPreferences prefs) {
            this.prefs = prefs;
        }

        @JavascriptInterface
        public void save(String data) {
            prefs.edit().putString("save", data).apply();
        }

        @JavascriptInterface
        public String load() {
            return prefs.getString("save", "");
        }
    }
}
