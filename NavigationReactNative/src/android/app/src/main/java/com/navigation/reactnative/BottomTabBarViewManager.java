package com.navigation.reactnative;

import android.view.Menu;
import android.view.MenuItem;
import android.view.View;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

import javax.annotation.Nonnull;

public class BottomTabBarViewManager extends ViewGroupManager<BottomTabBarView> {
    @Nonnull
    @Override
    public String getName() {
        return "NVBottomTabBar";
    }

    @Nonnull
    @Override
    protected BottomTabBarView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new BottomTabBarView(reactContext);
    }

    @Override
    public int getChildCount(BottomTabBarView parent) {
        return parent.getTabsCount();
    }

    @Override
    public View getChildAt(BottomTabBarView parent, int index) {
        return parent.getTabAt(index);
    }

    @Override
    public void addView(BottomTabBarView parent, View child, int index) {
        parent.addTab((TabBarItemView) child, index);

    }

    @Override
    public void removeViewAt(BottomTabBarView parent, int index) {
        parent.removeTab(index);
    }

}
