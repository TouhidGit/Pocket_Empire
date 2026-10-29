package com.touhidgit.pocketmogul;

import android.app.Activity;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/** Shows the HTML game (the /game folder, packed into the APK's assets) in a full-screen WebView. */
public class MainActivity extends Activity {

    private WebView webView;

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
        webView.setWebChromeClient(new WebChromeClient());
        webView.addJavascriptInterface(new SaveBridge(getSharedPreferences("pocket_mogul", MODE_PRIVATE)), "AndroidBridge");

        setContentView(webView);
        webView.loadUrl("file:///android_asset/index.html");
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
