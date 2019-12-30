package com.navigation.reactnative;

import android.content.Context;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.view.MenuItem;

import com.google.android.material.bottomnavigation.BottomNavigationView;

import java.util.ArrayList;
import java.util.List;

public class BottomTabBarView extends BottomNavigationView {

    private List<TabBarItemView> tabs = new ArrayList<>();

    public BottomTabBarView(Context context) {
        super(context);
    }

    int getTabsCount() {
        return tabs.size();
    }

    TabBarItemView getTabAt(int index) {
        return tabs.get(index);
    }

    void addTab(TabBarItemView tab, int index) {
        if (index > tabs.size() - 1) {
            tabs.add(index, tab);
        } else {
            tabs.add(index, tab);
        }

        final MenuItem menuItem = getMenu().add(tab.title);
        tab.setOnIconListener(new TabBarItemView.OnIconListener() {
            @Override
            public void onIconResolve(Drawable icon) {
                if (icon != null) {
                    menuItem.setIcon(icon);
                }
            }
        });
    }

    void removeTab(int index) {
        getMenu().removeItem(index);
        tabs.remove(index);
    }
}

