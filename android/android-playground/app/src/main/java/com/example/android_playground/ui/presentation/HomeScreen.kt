package com.example.android_playground.ui.presentation

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Create
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Receipt
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.outlined.ContentCopy
import androidx.compose.material.icons.outlined.Create
import androidx.compose.material.icons.outlined.ExitToApp
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material.icons.outlined.Receipt
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Divider
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.ClipboardManager
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.android_playground.ui.theme.Typography
import com.example.android_playground.utils.TabBarItem
import com.example.android_playground.utils.TabView
import com.example.android_playground.utils.addressAbbreviation
import com.example.android_playground.utils.chainConfigList
import com.example.android_playground.viewmodel.MainViewModel
import com.example.androidsolanaexample.ui.presentation.UserInfoDialog

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(viewModel: MainViewModel) {
    val homeTab = TabBarItem(
        title = "Home",
        selectedIcon = Icons.Filled.Home,
        unselectedIcon = Icons.Outlined.Home
    )
    val alertsTab = TabBarItem(
        title = "Sign",
        selectedIcon = Icons.Filled.Create,
        unselectedIcon = Icons.Outlined.Create
    )
    val settingsTab = TabBarItem(
        title = "Smart Contracts",
        selectedIcon = Icons.Filled.Receipt,
        unselectedIcon = Icons.Outlined.Receipt
    )

    val tabBarItems = listOf(homeTab, alertsTab, settingsTab)
    
    val navController = rememberNavController()

    if (viewModel.isAccountLoaded.collectAsState().value) {
        Scaffold(
            topBar = {
                TopAppBar(
                    title = {
                        Text(text = "Android Playground")
                    },

                    actions = {
                        Row {
                            IconButton(onClick = { viewModel.logOut() }) {
                                Icon(Icons.Outlined.ExitToApp, contentDescription = "Logout")
                            }
                        }
                    }
                )
            },
            bottomBar = {
                TabView(tabBarItems = tabBarItems, navController = navController)
            }
        ) { innerPadding ->
            NavHost(navController = navController, startDestination = "Home", modifier = Modifier.padding(innerPadding)) {
                composable(homeTab.title) {
                    AccountView(viewModel = viewModel)
                }
                composable(alertsTab.title) {
                    TransactionScreen(viewModel = viewModel)
                }
                composable(settingsTab.title) {
                   SmartContractsScreen(viewModel = viewModel)
                }
            }
        }
    } else {
        Box(modifier = Modifier
            .fillMaxWidth()
            .fillMaxHeight(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator()
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AccountView(viewModel: MainViewModel) {
    var expanded by remember { mutableStateOf(false) }
    var selectedText by remember { mutableStateOf(chainConfigList[0]) }
    val openUserInfoDialog = remember {
        mutableStateOf(false)
    }
    var balance = viewModel.balance.collectAsState().value
    val clipboardManager: ClipboardManager = LocalClipboardManager.current

    if(openUserInfoDialog.value) {
        UserInfoDialog(onDismissRequest = {
            openUserInfoDialog.value = false
        }, userInfo = viewModel.userInfo.toString())
    }

    LazyColumn(
        modifier = Modifier
            .padding(PaddingValues(horizontal = 16.dp, vertical = 8.dp))
    ) {
        item {
            Box(modifier = Modifier.height(16.dp))
            Text(
                text = "Welcome to Android Playground",
                style = Typography.headlineLarge,
                textAlign = TextAlign.Center
            )
            Box(modifier = Modifier.height(48.dp))
            Text(text = "Your account details")
            Box(modifier = Modifier.height(16.dp))
            Box(
                modifier = Modifier
                    .fillMaxWidth()
            ) {
                ExposedDropdownMenuBox(
                    expanded = expanded,
                    onExpandedChange = {
                        expanded = !expanded
                    }
                ) {
                    OutlinedTextField(
                        value = selectedText.displayName!!,
                        onValueChange = {},
                        readOnly = true,
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
                        modifier = Modifier
                            .menuAnchor()
                            .fillMaxWidth()
                    )

                    ExposedDropdownMenu(
                        expanded = expanded,
                        onDismissRequest = { expanded = false }
                    ) {
                        chainConfigList.forEach { item ->
                            DropdownMenuItem(
                                text = { Text(text = item.displayName!!) },
                                onClick = {
                                    selectedText = item
                                    expanded = false
                                    viewModel.changeChainConfig(item)
                                }
                            )
                        }
                    }
                }
            }
            Box(modifier = Modifier.height(24.dp))
            Divider()
            Box(modifier = Modifier.height(24.dp))
            Row {
                Box(
                    modifier = Modifier
                        .height(120.dp)
                        .width(120.dp)
                        .background(color = MaterialTheme.colorScheme.primary), contentAlignment = Alignment.Center
                ) {
                    Text(text = "A", style = Typography.headlineLarge.copy(color = Color.White))
                }

                Box(modifier = Modifier.width(16.dp))
                Column {
                    Text(text = viewModel.userInfo.name, style = Typography.titleLarge)
                    Box(modifier = Modifier.height(12.dp))
                    Row(horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                        Text(text = viewModel.credentials.address.addressAbbreviation(), style = Typography.titleMedium)
                        IconButton(onClick = {
                            clipboardManager.setText(AnnotatedString(viewModel.credentials.address))
                        }) {
                            Icon(Icons.Outlined.ContentCopy, contentDescription = "Copy")
                        }
                    }
                }
            }
            Box(modifier = Modifier.height(16.dp))
            Button(onClick = {
                openUserInfoDialog.value = true
            }, shape = RoundedCornerShape(4.dp), modifier = Modifier.fillMaxWidth()) {
                Text(text = "View user info")
            }
            Box(modifier = Modifier.height(16.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Column {
                    Text(text = "Wallet Balance", style = Typography.titleMedium)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(text = balance, style = Typography.headlineSmall)
                }
                Column(horizontalAlignment = Alignment.End) {
                    Text(text = "Chain id", style = Typography.titleMedium)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(text = selectedText.chainId,style = Typography.headlineSmall)
                }
            }
        }
    }
}
