package com.example.test11;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    WebView myWeb;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        myWeb = findViewById(R.id.webview);

        WebSettings webSettings = myWeb.getSettings();
        webSettings.setJavaScriptEnabled(true);  // Enable JavaScript for interactivity
        webSettings.setAllowContentAccess(true);
        webSettings.setDomStorageEnabled(true);  // Allows storage access for the WebView
        webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);  // Allow mixed HTTP and HTTPS

        myWeb.setWebViewClient(new WebViewClient());
        myWeb.loadUrl("http://x.x.x.x:8100");
    }
}
